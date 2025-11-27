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
        public int? IdUsuario { get; set; }

        [Column("idEmpresa")]
        public int? IdEmpresa { get; set; }

        [Column("nome")]
        [StringLength(200)]
        public string? Nome { get; set; }

        [Column("prazo")]
        public DateOnly? Prazo { get; set; }

        [Column("status")]
        public bool Status { get; set; }

        [Column("versao")]
        [Unicode(false)]
        public decimal Versao { get; set; }

        [Column("arquivo", TypeName = "varbinary(max)")]
        public byte[]? Arquivo { get; set; }

        [Column("mimeType")]
        [StringLength(100)]
        public string? MimeType { get; set; }

        [Column("versaoAtual")]
        public decimal VersaoAtual { get; set; }

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

        [ForeignKey("IdUsuario")]
        public virtual Usuario? UsuarioNavigation { get; set; }

        [ForeignKey("IdEmpresa")]
        public virtual Empresa? EmpresaNavigation { get; set; }

        // RELACIONAMENTOS (comentários, versões, regras, reqdocs)
        [InverseProperty("IdDocumentoNavigation")]
        public virtual ICollection<Comentario> Comentarios { get; set; } = new List<Comentario>();

        [InverseProperty("IdDocumentoNavigation")]
        public virtual ICollection<DocumentoVersoes> DocumentoVersos { get; set; } = new List<DocumentoVersoes>();

        [InverseProperty("IdDocumentoNavigation")]
        public virtual ICollection<RegrasDoc> RegrasDocs { get; set; } = new List<RegrasDoc>();

        [InverseProperty("IdDocumentoNavigation")]
        public virtual ICollection<ReqDoc> ReqDocs { get; set; } = new List<ReqDoc>();
    }
}
