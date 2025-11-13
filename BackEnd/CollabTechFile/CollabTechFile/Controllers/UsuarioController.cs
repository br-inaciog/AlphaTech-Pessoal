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
        public IActionResult Post(Usuario usuario)
        {
            try
            {
                _UsuarioRepository.Cadastrar(usuario);
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
//        [HttpPost("RedefinirSenha")]
//        public IActionResult RedefinirSenha(RedefinirSenhaDTO dto)
//        {
//            try
//            {
//                var usuario = _UsuarioRepository.BuscarPorId(dto.IdUsuario);

//                if (usuario == null)
//                    return NotFound("Usuário não encontrado");

//                usuario.Senha = Criptografia.GerarHash(dto.novaSenha);

//                _UsuarioRepository.Editar(usuario.IdUsuario, usuario);

//                return Ok("Senha redefinida com sucesso!");
//            }
//            catch (Exception e)
//            {
//                return BadRequest(e.Message);
//            }
//        }

        //[HttpPut("{id}")]
        //public IActionResult Put(int id, Usuario usuario)
        //{
        //    // Este método é suficiente para edição E exclusão
        //}

    }
}
