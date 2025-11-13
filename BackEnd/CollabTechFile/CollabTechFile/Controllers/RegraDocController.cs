using CollabTechFile.Interfaces;
using CollabTechFile.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CollabTechFile.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class RegraDocController : ControllerBase
    {
        private readonly IRegrasDocRepository _regrasDocRepository;
        public RegraDocController(IRegrasDocRepository regraDocRepository)
        {
            _regrasDocRepository = regraDocRepository;
        }

        //[Authorize]
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                List<RegrasDoc>listarRegras = _regrasDocRepository.Listar();
                return Ok(listarRegras);
            } 
            catch (Exception)
            {
                throw;
            }
        }

        //[Authorize]
        [HttpPost]
        public IActionResult Post (RegrasDoc regrasDoc)
        {
            try
            {
                _regrasDocRepository.Cadastrar(regrasDoc);
                return StatusCode(201, regrasDoc);
            }
            catch (Exception)
            {
                throw;
            }
        }

        //[Authorize]
        [HttpDelete("{id}")]
        public IActionResult Delete (int id)
        {
            try
            {
                _regrasDocRepository.Deletar(id);
                return NoContent();
            }
            catch(Exception error)
            {
                return BadRequest(error.Message);
            }
        }

        //[Authorize]
        [HttpPut("{id}")]
        public IActionResult Put(int id, RegrasDoc regrasDoc)
        {
            try {
                _regrasDocRepository.Editar(id, regrasDoc);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}
