using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

public static class GmailServiceFactory
{
    public static async Task<GmailService> CreateAsync()
    {
        // Escopo mínimo necessário para enviar e-mails
        string[] Scopes = { GmailService.Scope.GmailSend };
        string ApplicationName = "Envio de Email via API Gmail C#";

        UserCredential credential;

        using (var stream = new FileStream("credentials.json", FileMode.Open, FileAccess.Read))
        {
            string credPath = "token.json"; // onde o token será armazenado (para evitar login toda vez)
            credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
                GoogleClientSecrets.FromStream(stream).Secrets,
                Scopes,
                "user",
                CancellationToken.None,
                new FileDataStore(credPath, true));
        }

        // Cria o serviço autenticado
        var service = new GmailService(new BaseClientService.Initializer()
        {
            HttpClientInitializer = credential,
            ApplicationName = ApplicationName,
        });

        return service;
    }
}
