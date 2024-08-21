namespace UserApi.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public AccountDto? Account { get; set; }
        public List<SigninDto>? Signins { get; set; }
        public string? ActiveMsg { get; set; }
        public bool ActiveStatus { get; set; }
    }
}