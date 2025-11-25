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

    public class ReqDocController : ControllerBase
    {
        private readonly IReqDocRepository _ReqDocRepository;

        public ReqDocController(IReqDocRepository reqDocRepository)
        {
            _ReqDocRepository = reqDocRepository;
        }

        //[Authorize]
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                List<ReqDoc> listarReqDocs = _ReqDocRepository.Listar();
                return Ok(listarReqDocs);
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
                _ReqDocRepository.Deletar(id);
                return NoContent();
            }
            catch (Exception error)
            {
                return BadRequest(error.Message);
            }
        }

        //[Authorize]
        [HttpPut("{id}")]
        public IActionResult Put(int id, ReqDoc reqDoc)
        {
            try
            {
                _ReqDocRepository.Editar(id, reqDoc);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        //[Authorize]
        [HttpPost]
        public IActionResult Post(ReqDoc reqDoc)
        {
            try
            {
                _ReqDocRepository.Cadastrar(reqDoc);
                return StatusCode(201, reqDoc);
            }
            catch (Exception)
            {
                throw;
            }
        }

    }
}