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
    public class SuporteController : ControllerBase
    {

        private readonly ISuporteRepository _SuporteRepository;

        public SuporteController(ISuporteRepository suporteRepository)
        {
            _SuporteRepository = suporteRepository;
        }

        //[Authorize]
        [HttpPost]
        public IActionResult Post(Suporte suporte)
        {

            try
            {
                _SuporteRepository.Cadastrar(suporte);
                return StatusCode(201, suporte);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                List<Suporte> listarFeeddBack = _SuporteRepository.Listar();
                return Ok(listarFeeddBack);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                _SuporteRepository.Deletar(id);

                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
