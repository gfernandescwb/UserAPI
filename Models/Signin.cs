using UserApi.Enums;

namespace UserApi.Models
{
    public class Signin
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public DateTime AccessDate { get; set; }
        public AccessMessage AccessMsg { get; set; }
        public bool AccessStatus { get; set; }
        public int UserId { get; set; }
        public User UserNavigation { get; set; } = new User();
    }

}
