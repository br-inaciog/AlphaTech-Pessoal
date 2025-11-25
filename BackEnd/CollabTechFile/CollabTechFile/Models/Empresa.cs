using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CollabTechFile.Models
{
    [Table("Empresa")]
    public class Empresa
    {
        [Key]
        [Column("idEmpresa")]
        public int IdEmpresa { get; set; }

        [Column("nome")]
        [StringLength(100)]
        public string Nome { get; set; }

        [Column("cnpj")]
        [StringLength(18)]
        public string? Cnpj { get; set; }

        [Column("ativo")]
        public bool Ativo { get; set; } = true;

        [InverseProperty("EmpresaNavigation")]
        public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();

        [InverseProperty("EmpresaNavigation")]
        public virtual ICollection<Documento> Documentos { get; set; } = new List<Documento>();

    }
}
