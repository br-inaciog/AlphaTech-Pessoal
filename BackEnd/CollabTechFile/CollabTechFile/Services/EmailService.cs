using CollabTechFile.Models;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
using Google.Apis.Util;
using MimeKit;
public class EmailService
{
    private const string SenhaPadrao = "Senai@12";

    // 1. Defina o método de envio (exemplo)
    public async Task EnviarEmailAsync(GmailService service, string destinatario)
    {
        // --- 2. CONSTRUÇÃO DA MENSAGEM MIME (MimeKit) ---
        var emailMessage = new MimeMessage();
        emailMessage.From.Add(new MailboxAddress("AlphaTech", "alphatech6@gmail.com"));
        emailMessage.To.Add(new MailboxAddress("Destinatário", destinatario));
        emailMessage.Subject = "Acesso ao sistema CollabTechFile";

        string mensagem = $@"
            <h2>Bem-vindo ao sistema CollabTechFile!</h2>
            <p>Seu cadastro foi realizado com sucesso.</p>
            <p><strong>Login:</strong> {destinatario}</p>
            <p><strong>Senha:</strong> {SenhaPadrao}</p>
            <p>Por motivos de segurança, altere sua senha no primeiro acesso.</p>
        ";

        // Configura o corpo do e-mail (Texto simples e HTML)
        var builder = new BodyBuilder
        {
            HtmlBody = @$"<h2>Bem-vindo ao sistema CollabTechFile!</h2>
            <p>Seu cadastro foi realizado com sucesso.</p>
            <p><strong>Login:</strong> {destinatario}</p>
            <p><strong>Senha:</strong> {SenhaPadrao}</p>
            <p>Por motivos de segurança, altere sua senha no primeiro acesso.</p>"
        };

        // Adicione o body (corpo) à mensagem
        emailMessage.Body = builder.ToMessageBody();

        // --- 3. CONVERSÃO PARA BASE64URL ---

        // Converte o MimeMessage para um array de bytes
        byte[] messageBytes;
        using (var stream = new MemoryStream())
        {
            await emailMessage.WriteToAsync(stream);
            messageBytes = stream.ToArray();
        }

        // Codifica os bytes em Base64url (formato exigido pela Gmail API)
        // O Base64UrlEncoder está tipicamente em Google.Apis.Core.Web
        string base64UrlString = Convert.ToBase64String(messageBytes)
        .Replace('+', '-')
        .Replace('/', '_')
        .Replace("=", "");

        // --- 4. CRIAÇÃO DO OBJETO MESSAGE E ENVIO ---

        // Cria o objeto Message da Gmail API
        var message = new Message
        {
            // Define o corpo do e-mail no formato Base64url
            Raw = base64UrlString
        };

        // Envia o e-mail: "me" refere-se ao usuário autenticado
        try
        {
            var request = service.Users.Messages.Send(message, "me");
            var response = await request.ExecuteAsync();

            // Retorna o ID da mensagem enviada
            Console.WriteLine($"E-mail enviado com sucesso! ID: {response.Id}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao enviar e-mail: {ex.Message}");
        }
    }
}