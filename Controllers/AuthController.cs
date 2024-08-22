using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

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
        private readonly ILogger<AuthController> _logger;

        public AuthController(ApplicationDbContext context, IConfiguration config, ILogger<AuthController> logger)
        {
            _context = context;
            _config = config;
            _logger = logger;
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
                _logger.LogWarning("Attempt to register with already taken username: {Username}", registerModel.Username);
                return BadRequest(new { message = "Username already taken" });
            }

            _logger.LogInformation("Starting user registration process for {Username}", registerModel.Username);

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

            _logger.LogInformation("User logged out successfully.");
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
                _logger.LogWarning("Authentication failed: User not found or inactive.");
                return null;
            }

            var now = DateTime.UtcNow;

            var lastThreeAttempts = await _context.Signins
                .Where(s => s.UserId == user.Id)
                .OrderByDescending(s => s.AccessDate)
                .Take(3)
                .ToListAsync();

            if (lastThreeAttempts.Count == 3 && lastThreeAttempts.All(a => !a.AccessStatus) && lastThreeAttempts.All(a => a.AccessDate > now.AddMinutes(-20)))
            {
                user.ActiveMsg = ActiveMessage.BLOCKED;
                user.ActiveStatus = false;
                _context.Entry(user).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                _logger.LogWarning("User account blocked due to multiple failed login attempts.");
                return null;
            }

            if (account == null || account.Password == null)
            {
                _logger.LogWarning("Authentication failed: Account not found or password missing.");
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
                _logger.LogWarning("Authentication failed: Incorrect password for {Email}", login.Email);
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
            _logger.LogInformation("User {Email} authenticated successfully.", login.Email);

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
            _logger.LogInformation("JWT token generated for user {Email}.", account.Email);
            return tokenHandler.WriteToken(token);
        }
    }
}
