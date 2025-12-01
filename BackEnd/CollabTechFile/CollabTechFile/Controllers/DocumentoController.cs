using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;
using CollabTechFile.DTO;
using CollabTechFile.Interfaces;
using CollabTechFile.Models;
using CollabTechFile.Repositories;
using CollabTechFile.Services;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
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
            try
            {
                var documentos = _documentoRepository
                    .Listar()
                    .Where(d => d.Status);

                return Ok(documentos);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao listar documentos: {ex.Message}");
            }
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

        [HttpPut("status/{id}")]
        public IActionResult AtualizarStatus(int id, [FromBody] AtualizarStatusDTO dto)
        {
            try
            {
                _documentoRepository.AtualizarStatus(id, dto.NovoStatus);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao atualizar status: {ex.Message}");
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

        [HttpGet("{id}/ocr")]
        public IActionResult ObterTextoOcr(int id)
        {
            var doc = _documentoRepository.BuscarPorId(id);

            if (doc == null)
                return NotFound("Documento não encontrado.");

            return Ok(new
            {
                nome = doc.Nome,
                texto = doc.TextoOcr ?? ""
            });
        }

        [HttpPost("analisar")]
        public async Task<IActionResult> Analisar(
            IFormFile arquivo,
            int idUsuario,
            int idEmpresa,
            [FromServices] IConfiguration _config,
            [FromServices] IDocumentoRepository _documentoRepository) // Adicionado para salvar no BD
        {
            // --- 1. VALIDAÇÃO INICIAL ---
            if (arquivo == null || arquivo.Length == 0)
                return BadRequest("Nenhum arquivo foi enviado.");

            if (idUsuario <= 0)
                return BadRequest("ID do Usuário logado é obrigatório.");

            if (idEmpresa <= 0)
                return BadRequest("ID da Empresa é obrigatório.");

            try
            {
                // ---------- AZURE CONFIG ----------
                string endpoint = _config["AzureDocIntelligence:Endpoint"];
                string apiKey = _config["AzureDocIntelligence:Key"];
                string modelId = _config["AzureDocIntelligence:ModelId"];

                var client = new DocumentAnalysisClient(new Uri(endpoint), new AzureKeyCredential(apiKey));
                using var stream = arquivo.OpenReadStream();

                AnalyzeDocumentOperation operation =
                    await client.AnalyzeDocumentAsync(WaitUntil.Completed, modelId, stream);

                AnalyzeResult result = operation.Value;

                if (result.Documents == null || !result.Documents.Any())
                    return BadRequest("O modelo de IA não conseguiu extrair informações do documento.");

                var doc = result.Documents.First();

                // -----------------------
                // 2. EXTRAIR CAMPOS
                // -----------------------
                string Nome = doc.Fields.ContainsKey("Nome") ? doc.Fields["Nome"].Content?.Replace("Nome:", "").Trim() : null;
                string Data = doc.Fields.ContainsKey("Data") ? doc.Fields["Data"].Content?.Trim() : null;
                string Versao = doc.Fields.ContainsKey("Versao") ? doc.Fields["Versao"].Content?.Trim() : "1";

                string Descricao = doc.Fields.ContainsKey("Descriçao") ? doc.Fields["Descriçao"].Content : "";
                string Funcoes = doc.Fields.ContainsKey("Funçoes") ? doc.Fields["Funçoes"].Content : "";
                string ReqFunc = doc.Fields.ContainsKey("Requisitos Funcionais") ? doc.Fields["Requisitos Funcionais"].Content : "";
                string ReqNaoFunc = doc.Fields.ContainsKey("Requisitos nao funcionais") ? doc.Fields["Requisitos nao funcionais"].Content : "";
                string Regras = doc.Fields.ContainsKey("Regras de Negocio") ? doc.Fields["Regras de Negocio"].Content : "";

                string textoOcr = $"{Descricao}\n{Funcoes}\n{ReqFunc}\n{ReqNaoFunc}\n{Regras}";

                // -----------------------
                // 3. DATA → DateOnly
                // -----------------------
                DateOnly prazo = DateOnly.FromDateTime(
                    DateTime.TryParse(Data, out DateTime temp) ? temp : DateTime.Now.AddDays(7) // Adicionado 7 dias de fallback
                );

                // -----------------------
                // 4. ARQUIVO → byte[]
                // -----------------------
                byte[] bytesArquivo;
                using (var ms = new MemoryStream())
                {
                    await arquivo.CopyToAsync(ms);
                    bytesArquivo = ms.ToArray();
                }

                // -----------------------
                // 5. MONTAR DOCUMENTO
                // -----------------------
                var documento = new Documento
                {
                    IdEmpresa = idEmpresa,      // USANDO PARÂMETRO PASSADO
                    IdUsuario = idUsuario,      // USANDO PARÂMETRO PASSADO
                    Nome = Nome ?? "Documento Analisado IA", // Fallback para Nome
                    Prazo = prazo,
                    Status = true,
                    Versao = decimal.TryParse(Versao, NumberStyles.Any, new CultureInfo("pt-BR"), out var dv) ? dv : 1,
                    Arquivo = bytesArquivo,
                    TextoOcr = textoOcr,
                    MimeType = arquivo.ContentType,
                    VersaoAtual = decimal.TryParse(Versao, NumberStyles.Any, new CultureInfo("pt-BR"), out var dva) ? dva : 1,
                    CriadoEm = DateTime.Now,
                    NovoStatus = "Em Andamento",
                    ReqDocs = new List<ReqDoc>(),
                    RegrasDocs = new List<RegrasDoc>()
                };

                // -----------------------
                // 6. MONTAR REQUISITOS (REQ_DOC)
                // -----------------------
                string[] SplitLines(string text) =>
                    string.IsNullOrWhiteSpace(text)
                        ? Array.Empty<string>()
                        : text
                            .Replace("·", "\n")
                            .Split('\n', StringSplitOptions.RemoveEmptyEntries)
                            .Select(l => l.Trim())
                            .Where(l => !string.IsNullOrWhiteSpace(l))
                            .ToArray();

                var linhasReq = SplitLines(ReqFunc).Concat(SplitLines(ReqNaoFunc)).ToArray();

                foreach (var linha in linhasReq)
                {
                    string codigo = null;
                    string texto = linha;

                    // Lógica para extrair código (RF01, RNF01, etc.)
                    if (linha.Contains(":"))
                    {
                        var idx = linha.IndexOf(':');
                        codigo = linha.Substring(0, idx).Trim();
                        texto = linha.Substring(idx + 1).Trim();
                    }
                    else if (linha.Contains("-"))
                    {
                        var idx = linha.IndexOf('-');
                        var possibleCode = linha.Substring(0, idx).Trim();
                        if (possibleCode.StartsWith("RF", StringComparison.OrdinalIgnoreCase) ||
                            possibleCode.StartsWith("RNF", StringComparison.OrdinalIgnoreCase) ||
                            possibleCode.All(ch => char.IsLetterOrDigit(ch)))
                        {
                            codigo = possibleCode;
                            texto = linha.Substring(idx + 1).Trim();
                        }
                    }
                    if (string.IsNullOrWhiteSpace(codigo))
                        codigo = "RF";

                    var requisito = new Requisito
                    {
                        Tipo = codigo,
                        TextoReq = texto
                    };

                    var reqDoc = new ReqDoc
                    {
                        IdRequisitoNavigation = requisito,
                        IdDocumentoNavigation = documento
                    };

                    documento.ReqDocs.Add(reqDoc);
                }

                // -----------------------
                // 7. MONTAR REGRAS DE NEGÓCIO (REGRAS_DOC)
                // -----------------------
                var linhasRegras = SplitLines(Regras);

                foreach (var linha in linhasRegras)
                {
                    string codigo = null;
                    string texto = linha;

                    if (linha.Contains(":"))
                    {
                        var idx = linha.IndexOf(':');
                        codigo = linha.Substring(0, idx).Trim();
                        texto = linha.Substring(idx + 1).Trim();
                    }
                    else if (linha.Contains("-"))
                    {
                        var idx = linha.IndexOf('-');
                        codigo = linha.Substring(0, idx).Trim();
                        texto = linha.Substring(idx + 1).Trim();
                    }

                    var regra = new Regra
                    {
                        Nome = string.IsNullOrWhiteSpace(codigo) ? texto : $"{codigo} - {texto}"
                    };

                    var regraDoc = new RegrasDoc
                    {
                        IdRegrasNavigation = regra,
                        IdDocumentoNavigation = documento
                    };

                    documento.RegrasDocs.Add(regraDoc);
                }

                // -----------------------
                // 8. SALVAR TUDO
                // -----------------------
                _documentoRepository.Cadastrar(documento);

                return Ok(new
                {
                    mensagem = "Documento, requisitos e regras cadastrados com sucesso através da IA!",
                    documento
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    $"Erro ao analisar/cadastrar documento: {ex.Message} | INNER: {ex.InnerException?.Message}");
            }
        }

        public class EditarTextoDTO
        {
            public string? Texto { get; set; }
        }

        [HttpPut("{id}/editar-ocr")]
        public IActionResult EditarOcr(int id, [FromBody] EditarTextoDTO dto)
        {
            var doc = _documentoRepository.BuscarPorId(id);
            if (doc == null)
                return NotFound("Documento não encontrado.");

            doc.TextoOcr = dto.Texto;

            try
            {
                _documentoRepository.Editar(id, doc);
                return Ok("Texto atualizado com sucesso!");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao salvar edição: {ex.Message}");
            }
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