using CollabTechFile.Models;
using CollabTechFile.Interfaces;
using CollabTechFile.Services;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;
using CollabTechFile.DTO;

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

        // LISTAR ATIVOS
        [HttpGet]
        public IActionResult Get()
        {
            var documentos = _documentoRepository.Listar()
                .Where(d => d.Status == true);

            return Ok(documentos);
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
                // 1. Ler PDF em memória
                using var ms = new MemoryStream();
                await request.Arquivo.CopyToAsync(ms);

                request.documento.Arquivo = ms.ToArray();
                request.documento.MimeType = request.Arquivo.ContentType;

                // 2. OCR direto dos bytes (sem arquivo temporário)
                string modelId = "prebuilt-document";
                var camposExtraidos = await _ocrService.ExtrairCamposAsync(request.documento.Arquivo, modelId);

                // 3. Criar comentários OCR
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

                // 4. Salvar no BD
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
