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

    public class ComentarioController : ControllerBase
    {

        private readonly IComentarioRepository _ComentarioRepository;

        public ComentarioController(IComentarioRepository comentarioRepository)
        {
            _ComentarioRepository = comentarioRepository;
        }

        //[Authorize]
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                List<Comentario> listarComentarios = _ComentarioRepository.Listar();
                return Ok(listarComentarios);
            }
            catch (Exception)
            {
                throw;
            }

        }

        //[Authorize]
        [HttpPost]
        public IActionResult Post(Comentario comentario)
        {

            try
            {
                _ComentarioRepository.Cadastrar(comentario);
                return StatusCode(201, comentario);
            }
            catch (Exception)
            {
                throw;
            }
        }

        //[Authorize]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                _ComentarioRepository.Deletar(id);
                return NoContent();
            }
            catch (Exception error)
            {
                return BadRequest(error.Message);
            }
        }
    }
}
