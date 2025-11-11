using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CollabTechFile.Models;

[Table("Empresa")]
public partial class Empresa
{
    [Key]
    public int IdEmpresa { get; set; }

    [Column("nome")]
    [StringLength(200)]
    public string Nome { get; set; } = null!;

    [Column("CNPJ")]
    [StringLength(18)]
    [Unicode(false)]
    public string? Cnpj { get; set; }

    [Column("ativo")]
    public bool? Ativo { get; set; }

    [InverseProperty("IdEmpresaNavigation")]
    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}
