using CollabTechFile.Interfaces;
using CollabTechFile.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace CollabTechFile.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class DocumentoVersoesController : ControllerBase
    {
        private readonly IDocumentoVersoesRepository _documentoVersoesRepository;

        public DocumentoVersoesController(IDocumentoVersoesRepository documentoVersoesRepository)
        {
            _documentoVersoesRepository = documentoVersoesRepository;
        }

        [HttpPost]
        public IActionResult Post([FromBody] DocumentoVersoes versao)
        {
            try
            {
                if (versao == null)
                    return BadRequest("Os dados da versão não foram enviados.");

                _documentoVersoesRepository.Cadastrar(versao);
                return StatusCode(201, versao);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao cadastrar versão: {ex.Message}");
            }
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                List<DocumentoVersoes> listarVersoes = _documentoVersoesRepository.Listar();
                return Ok(listarVersoes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao listar versões: {ex.Message}");
            }
        }

        [HttpGet("documento/{IdDocumento}")]
        public IActionResult GetPorDocumento(int IdDocumento)
        {
            try
            {
                var versoes = _documentoVersoesRepository.ListarPorDocumento(IdDocumento);
                if (versoes == null || versoes.Count == 0)
                    return NotFound($"Nenhuma versão encontrada para o documento {IdDocumento}.");

                return Ok(versoes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao listar versões do documento: {ex.Message}");
            }
        }
    }
}

