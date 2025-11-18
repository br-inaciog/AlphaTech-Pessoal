using CollabTechFile.DTO;
using CollabTechFile.Interfaces;
using CollabTechFile.Models;
using CollabTechFile.Repositories;
using CollabTechFile.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CollabTechFile.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]

    public class UsuarioController : ControllerBase
    {
        private const string SenhaPadrao = "Senai@12";

        private readonly IUsuarioRepository _UsuarioRepository;

        public UsuarioController(IUsuarioRepository usuarioRepository)
        {
            _UsuarioRepository = usuarioRepository;
        }

        //[Authorize]
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                List<Usuario> listarUsuarios = _UsuarioRepository.Listar();
                return Ok(listarUsuarios);
            }
            catch (Exception)
            {
                throw;
            }
        }

        //[Authorize]
        [HttpPost]
        public async Task <IActionResult> Post(Usuario usuario)
        {
            var gmailService = await GmailServiceFactory.CreateAsync();

            try
            {
                _UsuarioRepository.Cadastrar(usuario);

                var _emailService = new EmailService();


                await _emailService.EnviarEmailAsync(gmailService, usuario.Email!);

                return StatusCode(201, usuario);
            }
            catch (Exception)
            {
                throw;
            }
        }

        //[Authorize]
        [HttpPut("{id}")]
        public IActionResult Put(int id, Usuario usuario)
        {
            try
            {
                usuario.IdUsuario = id;
                _UsuarioRepository.Editar(id, usuario);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        //[Authorize]
        [HttpGet("BuscarPorEmailESenha")]
        public IActionResult Get(string email, string senha)
        {
            try
            {
                Usuario usuarioBuscado = _UsuarioRepository.BuscarPorEmailESenha(email, senha);

                if (usuarioBuscado != null)
                {
                    return Ok(usuarioBuscado);
                }
                return null!;
            }

            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }
        [HttpPut("RedefinirSenha/{id}")]
        public IActionResult RedefinirSenha(int id, [FromBody] RedefinirSenhaDTO dto)
        {
            try
            {
                var usuario = _UsuarioRepository.BuscarPorId(id);

                if (usuario == null)
                    return NotFound("Usuário não encontrado");

                // 1. Verifica se a senha do usuário ainda é a senha MOCADA
                bool usandoSenhaPadrao = Criptografia.CompararHash(SenhaPadrao, usuario.Senha);

                if (!usandoSenhaPadrao)
                    return BadRequest("A senha já foi alterada anteriormente.");

                // 2. Criptografa a nova senha
                usuario.Senha = Criptografia.GerarHash(dto.novaSenha);

                // 3. Atualiza no banco
                _UsuarioRepository.Editar(usuario.IdUsuario, usuario);

                return Ok("Senha redefinida com sucesso!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
