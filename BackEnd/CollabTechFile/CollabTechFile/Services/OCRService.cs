using Azure.AI.FormRecognizer.DocumentAnalysis;
using Azure;

namespace CollabTechFile.Services
{
    public class OCRService
    {
        private readonly string _endpoint;
        private readonly string _apiKey;

        public OCRService(IConfiguration configuration)
        {
            _endpoint = configuration["AzureFormRecognizer:Endpoint"];
            _apiKey = configuration["AzureFormRecognizer:ApiKey"];
        }

        // 1. Novo método: OCR direto de byte[]
        public async Task<Dictionary<string, string>> ExtrairCamposAsync(byte[] arquivoBytes, string modelId = "prebuilt-document")
        {
            var client = new DocumentAnalysisClient(
                new Uri(_endpoint),
                new AzureKeyCredential(_apiKey)
            );

            using var stream = new MemoryStream(arquivoBytes);

            var operation = await client.AnalyzeDocumentAsync(
                WaitUntil.Completed,
                modelId,
                stream
            );

            var result = operation.Value;
            var camposExtraidos = new Dictionary<string, string>();

            if (result.Documents.Count > 0)
            {
                foreach (var field in result.Documents[0].Fields)
                {
                    camposExtraidos[field.Key] = field.Value.Content;
                }
            }

            return camposExtraidos;
        }

        // 2. Método antigo mantido para compatibilidade
        public async Task<Dictionary<string, string>> ExtrairCamposAsync(string caminhoArquivo, string modelId = "prebuilt-document")
        {
            var bytes = await File.ReadAllBytesAsync(caminhoArquivo);
            return await ExtrairCamposAsync(bytes, modelId);
        }
    }
}
