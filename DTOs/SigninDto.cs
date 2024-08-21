namespace UserApi.DTOs
{
    public class SigninDto
    {
        public int Id { get; set; }
        public DateTime AccessDate { get; set; }
        public string AccessMsg { get; set; } = string.Empty;
        public bool AccessStatus { get; set; }
    }
}