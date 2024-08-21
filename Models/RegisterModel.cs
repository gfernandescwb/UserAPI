using System.ComponentModel.DataAnnotations;

namespace UserApi.Models
{
    public class RegisterModel
    {
        [Required]
        [StringLength(100, MinimumLength = 5)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 8)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Firstname { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Lastname { get; set; } = string.Empty;
    }
}
