using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace CollabTechFile.Models;

public partial class DocumentoVersoes
{
    [Key]
    public int IdDocumentoVersoes { get; set; }

    public int IdDocumento { get; set; }

    public decimal NumeroVersao { get; set; }

    [MaxLength(500)] 
    public string? Mensagem { get; set; }

    public DateTime? DataCriacao { get; set; } = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(
        DateTime.UtcNow,
        "E. South America Standard Time" 
    );

    [JsonIgnore]
    [ForeignKey("IdDocumento")]
    [InverseProperty("DocumentoVersos")]
    public virtual Documento? IdDocumentoNavigation { get; set; }
}
