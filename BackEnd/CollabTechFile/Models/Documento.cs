using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CollabTechFile.Models;

[Table("Documento")]
public partial class Documento
{
    [Key]
    public int IdDocumento { get; set; }

    public int? IdUsuario { get; set; }

    [Column("nome")]
    [StringLength(200)]
    public string? Nome { get; set; }

    [Column("prazo")]
    public DateOnly? Prazo { get; set; }

    [Column("status")]
    public bool Status { get; set; }

    [Column("versao")]
    [Unicode(false)]
    public double Versao { get; set; }

    // NOVO – PDF armazenado diretamente no banco
    [Column(TypeName = "varbinary(max)")]
    public byte[]? Arquivo { get; set; }

    [StringLength(100)]
    public string? MimeType { get; set; }

    public double VersaoAtual { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CriadoEm { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? NovoStatus { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? AssinadoEm { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? FinalizadoEm { get; set; }

    [InverseProperty("IdDocumentoNavigation")]
    public virtual ICollection<Comentario> Comentarios { get; set; } = new List<Comentario>();

    [InverseProperty("IdDocumentoNavigation")]
    public virtual ICollection<DocumentoVersoes> DocumentoVersos { get; set; } = new List<DocumentoVersoes>();

    [ForeignKey("IdUsuario")]
    [InverseProperty("Documentos")]
    public virtual Usuario? IdUsuarioNavigation { get; set; }

    [InverseProperty("IdDocumentoNavigation")]
    public virtual ICollection<RegrasDoc> RegrasDocs { get; set; } = new List<RegrasDoc>();

    [InverseProperty("IdDocumentoNavigation")]
    public virtual ICollection<ReqDoc> ReqDocs { get; set; } = new List<ReqDoc>();
}
