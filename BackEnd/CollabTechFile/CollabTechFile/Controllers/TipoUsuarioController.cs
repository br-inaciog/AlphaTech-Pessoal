using CollabTechFile.Interfaces;
using CollabTechFile.Models;
using CollabTechFile.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CollabTechFile.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class TipoUsuarioController : ControllerBase
    {
        private readonly ITipoUsuarioRepository _TipoUsuarioRepository;

        public TipoUsuarioController(ITipoUsuarioRepository tipousuarioRepository)
        {
            _TipoUsuarioRepository = tipousuarioRepository;
        }

        //[Authorize]
        [HttpPost]
        public IActionResult Post(TipoUsuario tipousuario)
        {
            try
            {
                _TipoUsuarioRepository.Cadastrar(tipousuario);
                return StatusCode(201, tipousuario);
            }
            catch (Exception)
            {
                throw;
            }

        }

        //[Authorize]
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                List<TipoUsuario> listarTiposUsuarios = _TipoUsuarioRepository.Listar();
                return Ok(listarTiposUsuarios);
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
