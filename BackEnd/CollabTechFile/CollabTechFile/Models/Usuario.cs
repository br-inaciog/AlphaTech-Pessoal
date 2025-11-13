using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CollabTechFile.Models
{
    [Table("Usuario")]
    public partial class Usuario
    {
        [Key]
        public int IdUsuario { get; set; }

        public int? IdTipoUsuario { get; set; }

        public int? IdEmpresa { get; set; }

        [Column("nome")]
        [StringLength(200)]
        public string Nome { get; set; } = null!;

        [Column("email")]
        [StringLength(200)]
        public string? Email { get; set; }

        [Column("senha")]
        [StringLength(255)]
        public string? Senha { get; set; }

        [Column("ativo")]
        public bool? Ativo { get; set; }

        [InverseProperty("Funcionario")]
        public virtual ICollection<Documento> DocumentosFuncionario { get; set; } = new List<Documento>();

        [InverseProperty("Cliente")]
        public virtual ICollection<Documento> DocumentosCliente { get; set; } = new List<Documento>();

        [InverseProperty("IdUsuarioNavigation")]
        public virtual ICollection<Comentario> Comentarios { get; set; } = new List<Comentario>();

        [InverseProperty("IdUsuarioNavigation")]
        public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

        [ForeignKey("IdEmpresa")]
        [InverseProperty("Usuarios")]
        public virtual Empresa? IdEmpresaNavigation { get; set; }

        [ForeignKey("IdTipoUsuario")]
        [InverseProperty("Usuarios")]
        public virtual TipoUsuario? IdTipoUsuarioNavigation { get; set; }
    }
}
