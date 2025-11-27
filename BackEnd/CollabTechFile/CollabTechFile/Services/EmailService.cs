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
                        <html dir=""ltr"" xmlns=""http://www.w3.org/1999/xhtml"" xmlns:o=""urn:schemas-microsoft-com:office:office"">
  <head>
    <meta charset=""UTF-8"">
    <meta content=""width=device-width, initial-scale=1"" name=""viewport"">
    <meta name=""x-apple-disable-message-reformatting"">
    <meta http-equiv=""X-UA-Compatible"" content=""IE=edge"">
    <meta content=""telephone=no"" name=""format-detection"">
    <title></title>
    <!--[if (mso 16)]>
    <style type=""text/css"">
    a {{text-decoration: none;}}
    </style>
    <![endif]-->
    <!--[if gte mso 9]><style>sup {{ font-size: 100% !important; }}</style><![endif]-->
    <!--[if gte mso 9]>
<noscript>
         <xml>
           <o:OfficeDocumentSettings>
           <o:AllowPNG></o:AllowPNG>
           <o:PixelsPerInch>96</o:PixelsPerInch>
           </o:OfficeDocumentSettings>
         </xml>
      </noscript>
<![endif]-->
    <!--[if !mso]><!-- -->
    <link href=""https://fonts.googleapis.com/css2?family=Orbitron&display=swap"" rel=""stylesheet"">
    <!--<![endif]-->
    <!--[if mso]><xml>
    <w:WordDocument xmlns:w=""urn:schemas-microsoft-com:office:word"">
      <w:DontUseAdvancedTypographyReadingMail/>
    </w:WordDocument>
    </xml><![endif]-->
  </head>
  <body class=""body"">
    <div dir=""ltr"" class=""es-wrapper-color"">
      <!--[if gte mso 9]>
			<v:background xmlns:v=""urn:schemas-microsoft-com:vml"" fill=""t"">
				<v:fill type=""tile"" color=""#07023c""></v:fill>
			</v:background>
		<![endif]-->
      <table width=""100%"" cellspacing=""0"" cellpadding=""0"" class=""es-wrapper"">
        <tbody>
          <tr>
            <td valign=""top"" class=""esd-email-paddings"">
              <table cellspacing=""0"" cellpadding=""0"" align=""center"" class=""es-content esd-header-popover"">
                <tbody>
                  <tr>
                    <td align=""center"" class=""esd-stripe"">
                      <table width=""600"" cellspacing=""0"" cellpadding=""0"" bgcolor=""#001337"" align=""center"" esd-img-prev-position=""center center"" class=""es-content-body"" style=""background-color: #001337"">
                        <tbody>
                          <tr>
                            <td align=""left"" class=""esd-structure es-p20t es-p10b es-p20r es-p20l"">
                              <table cellpadding=""0"" cellspacing=""0"" width=""100%"">
                                <tbody>
                                  <tr>
                                    <td width=""560"" valign=""top"" align=""center"" class=""es-m-p0r esd-container-frame"">
                                      <table cellpadding=""0"" cellspacing=""0"" width=""100%"">
                                        <tbody>
                                          <tr>
                                            <td align=""center"" class=""esd-block-image"" style=""font-size:0px"">
                                              <a target=""_blank"" href=""https://viewstripo.email"">
                                                <img src=""https://evxmfou.stripocdn.email/content/guids/1d491798-bd9c-4a6e-90ed-33b1ee13e16c/images/image__1_removebgpreview_1_1.png"" alt="""" title=""Logo"" width=""395"" class=""adapt-img"" style=""display: block"">
                                              </a>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align=""left"" class=""esd-structure es-p30t es-p30b es-p20r es-p20l"">
                              <table width=""100%"" cellspacing=""0"" cellpadding=""0"">
                                <tbody>
                                  <tr>
                                    <td width=""560"" valign=""top"" align=""center"" class=""es-m-p0r es-m-p20b esd-container-frame"">
                                      <table width=""100%"" cellspacing=""0"" cellpadding=""0"">
                                        <tbody>
                                          <tr>
                                            <td align=""center"" class=""esd-block-text"">
                                              <h1 style=""font-family: arial,&#39;helvetica neue&#39;,helvetica,sans-serif; color: #ffffff"">
                                                Bem vindo ao sistema!
                                              </h1>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align=""center"" class=""esd-block-text es-p10t es-p10b"">
                                              <p style=""color: #ffffff"">
                                                Seu cadastro foi realizado com sucesso
                                              </p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align=""center"" class=""esd-block-text es-p10t es-p10b"">
                                              <p style=""color: #ffffff"">
                                                <strong>Login:</strong> <strong>{destinatario}</strong>&nbsp;
                                              </p>
                                              <p style=""color: #ffffff"">
                                                <strong>Senha:</strong> <strong>{SenhaPadrao}</strong>&nbsp;
                                              </p>
                                              <p style=""color: #ffffff"">
                                                Por motivos de segurança, altere sua senha no primeiro acesso.
                                              </p>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align=""left"" bgcolor=""#001337"" class=""esd-structure es-p20t es-p20r es-p20l"" style=""background-color: #001337"">
                              <table width=""100%"" cellpadding=""0"" cellspacing=""0"">
                                <tbody>
                                  <tr>
                                    <td align=""left"" width=""560"" class=""esd-container-frame"">
                                      <table cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%"">
                                        <tbody>
                                          <tr>
                                            <td align=""center"" class=""esd-block-text"">
                                              <p style=""color: #ffffff"">
                                                <strong>solutions.alphatech6@gmail.com</strong>
                                              </p>
                                              <p style=""color: #ffffff"">
                                                <strong>​</strong>
                                              </p>
                                              <p style=""color: #ffffff"">
                                                <strong>Instagram: https://shre.ink/Alphatech</strong>
                                              </p>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>
        ";

        // Configura o corpo do e-mail (Texto simples e HTML)
        var builder = new BodyBuilder
        {
            HtmlBody = @$"<h2>Bem-vindo ao sistema CollabTechFile!</h2>
                        <html dir=""ltr"" xmlns=""http://www.w3.org/1999/xhtml"" xmlns:o=""urn:schemas-microsoft-com:office:office"">
  <head>
    <meta charset=""UTF-8"">
    <meta content=""width=device-width, initial-scale=1"" name=""viewport"">
    <meta name=""x-apple-disable-message-reformatting"">
    <meta http-equiv=""X-UA-Compatible"" content=""IE=edge"">
    <meta content=""telephone=no"" name=""format-detection"">
    <title></title>
    <!--[if (mso 16)]>
    <style type=""text/css"">
    a {{text-decoration: none;}}
    </style>
    <![endif]-->
    <!--[if gte mso 9]><style>sup {{ font-size: 100% !important; }}</style><![endif]-->
    <!--[if gte mso 9]>
<noscript>
         <xml>
           <o:OfficeDocumentSettings>
           <o:AllowPNG></o:AllowPNG>
           <o:PixelsPerInch>96</o:PixelsPerInch>
           </o:OfficeDocumentSettings>
         </xml>
      </noscript>
<![endif]-->
    <!--[if !mso]><!-- -->
    <link href=""https://fonts.googleapis.com/css2?family=Orbitron&display=swap"" rel=""stylesheet"">
    <!--<![endif]-->
    <!--[if mso]><xml>
    <w:WordDocument xmlns:w=""urn:schemas-microsoft-com:office:word"">
      <w:DontUseAdvancedTypographyReadingMail/>
    </w:WordDocument>
    </xml><![endif]-->
  </head>
  <body class=""body"">
    <div dir=""ltr"" class=""es-wrapper-color"">
      <!--[if gte mso 9]>
			<v:background xmlns:v=""urn:schemas-microsoft-com:vml"" fill=""t"">
				<v:fill type=""tile"" color=""#07023c""></v:fill>
			</v:background>
		<![endif]-->
      <table width=""100%"" cellspacing=""0"" cellpadding=""0"" class=""es-wrapper"">
        <tbody>
          <tr>
            <td valign=""top"" class=""esd-email-paddings"">
              <table cellspacing=""0"" cellpadding=""0"" align=""center"" class=""es-content esd-header-popover"">
                <tbody>
                  <tr>
                    <td align=""center"" class=""esd-stripe"">
                      <table width=""600"" cellspacing=""0"" cellpadding=""0"" bgcolor=""#001337"" align=""center"" esd-img-prev-position=""center center"" class=""es-content-body"" style=""background-color: #001337"">
                        <tbody>
                          <tr>
                            <td align=""left"" class=""esd-structure es-p20t es-p10b es-p20r es-p20l"">
                              <table cellpadding=""0"" cellspacing=""0"" width=""100%"">
                                <tbody>
                                  <tr>
                                    <td width=""560"" valign=""top"" align=""center"" class=""es-m-p0r esd-container-frame"">
                                      <table cellpadding=""0"" cellspacing=""0"" width=""100%"">
                                        <tbody>
                                          <tr>
                                            <td align=""center"" class=""esd-block-image"" style=""font-size:0px"">
                                              <a target=""_blank"" href=""https://viewstripo.email"">
                                                <img src=""https://evxmfou.stripocdn.email/content/guids/1d491798-bd9c-4a6e-90ed-33b1ee13e16c/images/image__1_removebgpreview_1_1.png"" alt="""" title=""Logo"" width=""395"" class=""adapt-img"" style=""display: block"">
                                              </a>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align=""left"" class=""esd-structure es-p30t es-p30b es-p20r es-p20l"">
                              <table width=""100%"" cellspacing=""0"" cellpadding=""0"">
                                <tbody>
                                  <tr>
                                    <td width=""560"" valign=""top"" align=""center"" class=""es-m-p0r es-m-p20b esd-container-frame"">
                                      <table width=""100%"" cellspacing=""0"" cellpadding=""0"">
                                        <tbody>
                                          <tr>
                                            <td align=""center"" class=""esd-block-text"">
                                              <h1 style=""font-family: arial,&#39;helvetica neue&#39;,helvetica,sans-serif; color: #ffffff"">
                                                Bem vindo ao sistema!
                                              </h1>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align=""center"" class=""esd-block-text es-p10t es-p10b"">
                                              <p style=""color: #ffffff"">
                                                Seu cadastro foi realizado com sucesso
                                              </p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align=""center"" class=""esd-block-text es-p10t es-p10b"">
                                              <p style=""color: #ffffff"">
                                                <strong>Login:</strong> <strong>{destinatario}</strong>&nbsp;
                                              </p>
                                              <p style=""color: #ffffff"">
                                                <strong>Senha:</strong> <strong>{SenhaPadrao}</strong>&nbsp;
                                              </p>
                                              <p style=""color: #ffffff"">
                                                Por motivos de segurança, altere sua senha no primeiro acesso.
                                              </p>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align=""left"" bgcolor=""#001337"" class=""esd-structure es-p20t es-p20r es-p20l"" style=""background-color: #001337"">
                              <table width=""100%"" cellpadding=""0"" cellspacing=""0"">
                                <tbody>
                                  <tr>
                                    <td align=""left"" width=""560"" class=""esd-container-frame"">
                                      <table cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%"">
                                        <tbody>
                                          <tr>
                                            <td align=""center"" class=""esd-block-text"">
                                              <p style=""color: #ffffff"">
                                                <strong>solutions.alphatech6@gmail.com</strong>
                                              </p>
                                              <p style=""color: #ffffff"">
                                                <strong>​</strong>
                                              </p>
                                              <p style=""color: #ffffff"">
                                                <strong>Instagram: https://shre.ink/Alphatech</strong>
                                              </p>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>"
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