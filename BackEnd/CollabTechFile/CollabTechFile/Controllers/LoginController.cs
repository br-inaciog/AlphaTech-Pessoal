using CollabTechFile.DTO;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using CollabTechFile.Models;
using CollabTechFile.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using CollabTechFile.Utils; // necessário para o hash

namespace CollabTechFile.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class LoginController : ControllerBase
    {
        private readonly IUsuarioRepository _UsuarioRepository;
        private const string senhaPadrao = "Senai@12";

        public LoginController(IUsuarioRepository usuarioRepository)
        {
            _UsuarioRepository = usuarioRepository;
        }

        [HttpPost]
        //public IActionResult Login(LoginDTO loginDTO)
        //{
        //    try
        //    {

        //        //Usuario usuarioBuscado = _UsuarioRepository.BuscarPorEmailESenha(loginDTO.Email, loginDTO.Senha);

        //        Usuario usuarioBuscado = _UsuarioRepository.BuscarPorEmail(loginDTO.Email);

        //        if (usuarioBuscado == null)
        //        {
        //            return NotFound("Usuario não cadastrado!");
        //        }

        //        // ✅ Verifica senha digitada
        //        bool senhaCorreta = Criptografia.CompararHash(loginDTO.Senha, usuarioBuscado.Senha);

        //        if (!senhaCorreta)
        //            return BadRequest("Senha incorreta!");

        //        // ✅ Verifica se a senha digitada é a senha padrão
        //        //bool ehSenhaPadrao = Criptografia.CompararHash(
        //        //    loginDTO.Senha,
        //        //    Criptografia.GerarHash(senhaPadrao)
        //        //);
        //        bool ehSenhaPadrao = Criptografia.CompararHash(senhaPadrao, usuarioBuscado.Senha);

        //        var claims = new[]
        //        {
        //            new Claim(JwtRegisteredClaimNames.Jti, usuarioBuscado.IdUsuario.ToString()),
        //            new Claim(JwtRegisteredClaimNames.Email, usuarioBuscado.Email),
        //            new Claim(JwtRegisteredClaimNames.Name, usuarioBuscado.Nome),
        //            new Claim("TipoUsuario", usuarioBuscado.IdTipoUsuarioNavigation?.TituloTipoUsuario ?? "Desconhecido")
        //        };

        //        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("collab-tech-file-chave-autenticacao"));
        //        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        //        var token = new JwtSecurityToken(
        //            issuer: "CollabTechFile.WebApi",
        //            audience: "CollabTechFile.WebApi",
        //            claims: claims,
        //            expires: DateTime.Now.AddMinutes(5),
        //            signingCredentials: creds
        //        );

        //        return Ok(new
        //        {
        //            token = new JwtSecurityTokenHandler().WriteToken(token),
        //            primeiraSenha = ehSenhaPadrao // ✅ FRONT SABE SE TEM QUE REDIRECIONAR
        //        });
        //    }
        //    catch (Exception e)
        //    {
        //        return BadRequest(e.Message);
        //    }
        //}


        public IActionResult Login(LoginDTO loginDTO)
        {
            try
            {
                Usuario usuarioBuscado = _UsuarioRepository.BuscarPorEmail(loginDTO.Email);

                if (usuarioBuscado == null)
                    return NotFound("Usuário não cadastrado!");

                // ✅ Verifica senha digitada
                bool senhaCorreta = Criptografia.CompararHash(loginDTO.Senha, usuarioBuscado.Senha);

                if (!senhaCorreta)
                    return BadRequest("Senha incorreta!");

                // ✅ Verifica se a senha atual do usuário é a senha padrão
                bool ehSenhaPadrao = Criptografia.CompararHash(senhaPadrao, usuarioBuscado.Senha);

                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Jti, usuarioBuscado.IdUsuario.ToString()),
                    new Claim(JwtRegisteredClaimNames.Email, usuarioBuscado.Email),
                    new Claim(JwtRegisteredClaimNames.Name, usuarioBuscado.Nome),
                    new Claim("TipoUsuario", usuarioBuscado.IdTipoUsuarioNavigation?.TituloTipoUsuario ?? "Desconhecido"),
                    new Claim("Empresa", usuarioBuscado.EmpresaNavigation?.Nome ?? "Desconhecido")
                 };

                var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("collab-tech-file-chave-autenticacao"));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: "CollabTechFile.WebApi",
                    audience: "CollabTechFile.WebApi",
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(5),
                    signingCredentials: creds
                );

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    primeiraSenha = ehSenhaPadrao 
                });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}