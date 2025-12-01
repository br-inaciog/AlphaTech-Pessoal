using CollabTechFile.Interfaces;
using CollabTechFile.Models;
using CollabTechFile.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CollabTechFile.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]

    public class RegraController : ControllerBase
    {
        private readonly IRegraRepository _RegraRepository;

        public RegraController(IRegraRepository regraRepository)
        {
            _RegraRepository = regraRepository;
        }

        //[Authorize]
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                List<Regra> listarRegras = _RegraRepository.Listar();
                return Ok(listarRegras);
            }
            catch (Exception)
            {
                throw;
            }

        }

        //[Authorize]
        [HttpPost]
        public IActionResult Post(Regra regra)
        {

            try
            {
                _RegraRepository.Cadastrar(regra);
                return StatusCode(201, regra);
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
                _RegraRepository.Deletar(id);
                return NoContent();
            }
            catch (Exception error)
            {
                return BadRequest(error.Message);
            }
        }

        [HttpDelete("regra-completa/{idRegraDoc}")]
        public async Task<IActionResult> DeletarRegraCompleta(int idRegraDoc)
        {
            var ok = await _RegraRepository.DeletarRegraCompletaAsync(idRegraDoc);

            if (!ok)
                return NotFound();

            return NoContent();
        }

        //[Authorize]
        [HttpPut("{id}")]
        public IActionResult Put(int id, Regra regra)
        {
            try
            {
                _RegraRepository.Editar(id, regra);
                return NoContent();

            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }


    }
}
