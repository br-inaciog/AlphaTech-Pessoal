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
    public class RequisitoController : ControllerBase
    {
        private readonly IRequisitoRepository _RequisitoRepository;

        public RequisitoController(IRequisitoRepository requisitoRepository)
        {
            _RequisitoRepository = requisitoRepository;
        }

        //[Authorize]
        [HttpGet]
        public IActionResult Get() {
            try
            {
                List<Requisito> listarRequisitos = _RequisitoRepository.Listar();
                return Ok(listarRequisitos);
            }
            catch (Exception)
            {
                throw;
            }

        }


        //[Authorize]
        [HttpPost]
        public IActionResult Post(Requisito requisitos)
        {

            try
            {
                _RequisitoRepository.Cadastrar(requisitos);
                return StatusCode(201, requisitos);
            }
            catch (Exception)
            {
                throw;
            }
        }


        //[Authorize]
        [HttpPut("{id}")]

        public IActionResult Put(int id, Requisito requisitos) {

            try
            {
                _RequisitoRepository.Editar(id, requisitos);
                return NoContent();

            }
            catch (Exception e) {

                return BadRequest(e.Message);
            }
        }


        //[Authorize]
        [HttpDelete("{id}")]

        public IActionResult Delete(int id) {
            try
            {
                _RequisitoRepository.Deletar(id);
                return NoContent();
            }
            catch (Exception error)
            {
                return BadRequest(error.Message);
            }
        }

        [HttpDelete("requisito-completo/{idRequisitoDoc}")]
        public async Task<IActionResult> DeletarRequisitoCompleto(int idRequisitoDoc)
        {
            var ok = await _RequisitoRepository.DeletarRequisitoCompletoAsync(idRequisitoDoc);

            if (!ok)
                return NotFound();

            return NoContent();
        }


    }
}
