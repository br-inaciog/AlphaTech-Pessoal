using CollabTechFile.Models;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CollabTechFile.Models
{
    [Table("Documento")]
    public class Documento
    {
        [Key]
        public int IdDocumento { get; set; }

        [Column("idUsuario")]
        public int? IdUsuario { get; set; } // funcionário

        [Column("idCliente")]
        public int? IdCliente { get; set; } // cliente

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

        [Column("arquivo", TypeName = "varbinary(max)")]
        public byte[]? Arquivo { get; set; }

        [Column("mimeType")]
        [StringLength(100)]
        public string? MimeType { get; set; }

        [Column("versaoAtual")]
        public double VersaoAtual { get; set; }

        [Column("criadoEm", TypeName = "datetime")]
        public DateTime CriadoEm { get; set; }

        [Column("novoStatus")]
        [StringLength(20)]
        [Unicode(false)]
        public string? NovoStatus { get; set; }

        [Column("assinadoEm", TypeName = "datetime")]
        public DateTime? AssinadoEm { get; set; }

        [Column("finalizadoEm", TypeName = "datetime")]
        public DateTime? FinalizadoEm { get; set; }

        // 🔹 Relações
        [InverseProperty("IdDocumentoNavigation")]
        public virtual ICollection<Comentario> Comentarios { get; set; } = new List<Comentario>();

        [InverseProperty("IdDocumentoNavigation")]
        public virtual ICollection<DocumentoVersoes> DocumentoVersos { get; set; } = new List<DocumentoVersoes>();

        [ForeignKey("IdUsuario")]
        [InverseProperty("DocumentosFuncionario")]
        public virtual Usuario? Funcionario { get; set; }

        [ForeignKey("IdCliente")]
        [InverseProperty("DocumentosCliente")]
        public virtual Usuario? Cliente { get; set; }

        [InverseProperty("IdDocumentoNavigation")]
        public virtual ICollection<RegrasDoc> RegrasDocs { get; set; } = new List<RegrasDoc>();

        [InverseProperty("IdDocumentoNavigation")]
        public virtual ICollection<ReqDoc> ReqDocs { get; set; } = new List<ReqDoc>();
    }
}
