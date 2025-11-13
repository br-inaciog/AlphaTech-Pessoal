using System.ComponentModel.DataAnnotations;

namespace CollabTechFile.DTO
{
    public class LoginDTO

    {
        [Required(ErrorMessage = "O Email é obrigatorio!")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "A senha é obrigatoria!")]
        [StringLength(8, MinimumLength = 6, ErrorMessage = "A senha deve conter no minimo 6 caracteres e no maximo 8")]
        public string? Senha { get; set; }
    }
}
