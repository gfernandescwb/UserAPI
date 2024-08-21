using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;

using UserApi.Models;
using UserApi.DTOs;
using UserApi.Data;
using UserApi.Enums;

namespace UserApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel login)
        {
            var user = await AuthenticateUserAsync(login);

            if (user != null)
            {
                var token = GenerateJwtToken(user);
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false,
                    Expires = DateTime.Now.AddMinutes(30),
                    SameSite = SameSiteMode.Strict
                };
                Response.Cookies.Append("jwt", token, cookieOptions);
                return Ok(new { message = "Login successful", token = token });
            }

            return Unauthorized();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel registerModel)
        {
            if (await _context.Accounts.AnyAsync(x => x.Username == registerModel.Username))
            {
                return BadRequest(new { message = "Username already taken" });
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerModel.Password);

            var account = new Account
            {
                Username = registerModel.Username,
                Password = hashedPassword,
                Email = registerModel.Email,
                Firstname = registerModel.Firstname,
                Lastname = registerModel.Lastname
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            var user = new User
            {
                Account = account.Id,
                ActiveMsg = ActiveMessage.ACTIVE,
                ActiveStatus = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            if (Request.Cookies["jwt"] != null)
            {
                Response.Cookies.Append("jwt", "", new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false,
                    Expires = DateTime.Now.AddDays(-1),
                    SameSite = SameSiteMode.Strict
                });
            }

            return Ok(new { message = "Logout successful" });
        }

        private async Task<Account?> AuthenticateUserAsync(LoginModel login)
        {
            var account = await _context.Accounts
                .Include(a => a.Users)
                .SingleOrDefaultAsync(x => x.Email == login.Email);

            var user = account?.Users.FirstOrDefault();

            if (user == null || !user.ActiveStatus)
            {
                return null;
            }

            var now = DateTime.UtcNow;
            var recentAttempts = await _context.Signins
                .AsNoTracking()
                .Where(s => s.Email == login.Email && s.AccessDate > now.AddMinutes(-20))
                .ToListAsync();

            if (recentAttempts.Count >= 3 && recentAttempts.All(a => !a.AccessStatus))
            {
                user.ActiveMsg = ActiveMessage.BLOCKED;
                user.ActiveStatus = false;
                await _context.SaveChangesAsync();
                return null;
            }

            if (account == null || account.Password == null)
            {
                return null;
            }

            if (!BCrypt.Net.BCrypt.Verify(login.Password, account.Password))
            {
                _context.Signins.Add(new Signin
                {
                    Email = login.Email,
                    AccessDate = DateTime.UtcNow,
                    AccessMsg = AccessMessage.PASSWORD,
                    AccessStatus = false,
                    UserId = user.Id
                });
                await _context.SaveChangesAsync();
                return null;
            }

            _context.Signins.Add(new Signin
            {
                Email = login.Email,
                AccessDate = DateTime.UtcNow,
                AccessMsg = AccessMessage.SUCCEED,
                AccessStatus = true,
                UserId = user.Id
            });
            await _context.SaveChangesAsync();

            return account;
        }

        private string GenerateJwtToken(Account account)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtKey = _config["Jwt:Key"] ?? throw new ArgumentNullException("Jwt:Key", "JWT key not configured");
            var key = Encoding.ASCII.GetBytes(jwtKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.Name, account.Email),
            new Claim(ClaimTypes.NameIdentifier, account.Id.ToString())
        }),
                Expires = DateTime.UtcNow.AddMinutes(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
