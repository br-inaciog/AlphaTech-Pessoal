using CollabTechFile.DTO;
using CollabTechFile.Interfaces;
using CollabTechFile.Models;
using CollabTechFile.Repositories;
using CollabTechFile.Services;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;

namespace CollabTechFile.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentosController : ControllerBase
    {
        private readonly IDocumentoRepository _documentoRepository;
        private readonly OCRService _ocrService;

        public DocumentosController(IDocumentoRepository documentoRepository, OCRService ocrService)
        {
            _documentoRepository = documentoRepository;
            _ocrService = ocrService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var documentos = _documentoRepository.Listar()
                .Where(d => d.Status == true);

            return Ok(documentos);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Documento documento)
        {
            try
            {
                if (documento == null)
                    return BadRequest("Os dados do documento não foram enviados.");

                documento.CriadoEm = DateTime.Now;
                documento.Status = true;

                _documentoRepository.Cadastrar(documento);

                return StatusCode(201, documento);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao cadastrar documento: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Documento documento)
        {
            if (id != documento.IdDocumento)
            {
                return BadRequest("O ID na URL não corresponde ao ID do documento.");
            }
            try
            {
                _documentoRepository.AtualizarVersao(id, documento);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao atualizar documento: {ex.Message}");
            }
        }

        [HttpGet("{id}")] 
        public IActionResult Get(int id)
        {
            try
            {
                var documento = _documentoRepository.BuscarPorId(id);

                if (documento == null)
                {
                    return NotFound($"Documento com ID {id} não encontrado.");
                }

                return Ok(documento);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao buscar documento: {ex.Message}");
            }
        }

        [HttpGet("Lixeira")]
        public IActionResult ListarLixeira()
        {
            var documentos = _documentoRepository.Listar()
                .Where(d => d.Status == false);

            return Ok(documentos);
        }

        [HttpPut("Inativar/{id}")]
        public IActionResult Inativar(int id)
        {
            var documento = _documentoRepository.BuscarPorId(id);
            if (documento == null)
                return NotFound("Documento não encontrado.");

            documento.Status = false;
            _documentoRepository.Editar(id, documento);

            return Ok("Documento movido para a lixeira com sucesso.");
        }

        // 
        [HttpPut("Restaurar/{id}")]
        public IActionResult Restaurar(int id)
        {
            var documento = _documentoRepository.BuscarPorId(id);
            if (documento == null)
                return NotFound("Documento não encontrado.");

            documento.Status = true;
            _documentoRepository.Editar(id, documento);

            return Ok("Documento restaurado com sucesso.");
        }

        [HttpDelete("Excluir/{id}")]
        public IActionResult Excluir(int id)
        {
            var documento = _documentoRepository.BuscarPorId(id);
            if (documento == null)
                return NotFound("Documento não encontrado.");

            _documentoRepository.Deletar(id);
            return Ok("Documento excluído permanentemente.");
        }

        [HttpPost("upload-ocr")]
        public async Task<IActionResult> UploadOCR([FromForm] UploadOCRRequest request)
        {
            if (request.Arquivo == null || request.Arquivo.Length == 0)
                return BadRequest("Nenhum arquivo enviado.");

            try
            {
                using var ms = new MemoryStream();
                await request.Arquivo.CopyToAsync(ms);

                request.documento.Arquivo = ms.ToArray();
                request.documento.MimeType = request.Arquivo.ContentType;

                string modelId = "prebuilt-document";
                var camposExtraidos = await _ocrService.ExtrairCamposAsync(request.documento.Arquivo, modelId);

                if (request.documento.Comentarios == null)
                    request.documento.Comentarios = new List<Comentario>();

                foreach (var campo in camposExtraidos)
                {
                    var texto = $"{campo.Key}: {campo.Value}";
                    if (texto.Length > 500)
                        texto = texto[..500];

                    request.documento.Comentarios.Add(new Comentario
                    {
                        Texto = texto
                    });
                }

                if (string.IsNullOrWhiteSpace(request.documento.Nome))
                    return BadRequest("O campo 'Titulo' do documento é obrigatório.");

                try
                {
                    _documentoRepository.Cadastrar(request.documento);
                }
                catch (Exception dbEx)
                {
                    var mensagemErro = dbEx.InnerException?.Message ?? dbEx.Message;
                    return StatusCode(500, $"Erro ao salvar no banco: {mensagemErro}");
                }

                return StatusCode(201, request.documento);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao processar documento: {ex.Message}");
            }
        }

        [HttpGet("{id}/pdf")]
        public IActionResult DownloadPdf(int id)
        {
            var documento = _documentoRepository.BuscarPorId(id);

            if (documento == null || documento.Arquivo == null)
                return NotFound("PDF não encontrado.");

            return File(
                fileContents: documento.Arquivo,
                contentType: documento.MimeType ?? "application/pdf",
                fileDownloadName: documento.Nome + ".pdf"
            );
        }

        [HttpPut("{id}/upload")]
        public async Task<IActionResult> AtualizarArquivo(int id, IFormFile arquivo)
        {
            if (arquivo == null || arquivo.Length == 0)
                return BadRequest("Nenhum arquivo enviado.");

            var documento = _documentoRepository.BuscarPorId(id);

            if (documento == null)
                return NotFound("Documento não encontrado.");

            using var ms = new MemoryStream();
            await arquivo.CopyToAsync(ms);

            documento.Arquivo = ms.ToArray();
            documento.MimeType = arquivo.ContentType;

            try
            {
                _documentoRepository.Editar(id, documento);
                return Ok("Arquivo atualizado com sucesso.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao atualizar arquivo: {ex.Message}");
            }
        }
    }
}
