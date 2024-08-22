using UserApi.Enums;

namespace UserApi.Models
{
    public class User
    {
        public int Id { get; set; }
        public int Account { get; set; }
        public ActiveMessage ActiveMsg { get; set; }
        public bool ActiveStatus { get; set; }
        public Account AccountNavigation { get; set; }  
        public ICollection<Signin> Signins { get; set; } = new List<Signin>();
    }
}
