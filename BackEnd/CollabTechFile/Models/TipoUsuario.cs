using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CollabTechFile.Models;

[Table("TipoUsuario")]
public partial class TipoUsuario
{
    [Key]
    public int IdTipoUsuario { get; set; }

    [StringLength(200)]
    public string TituloTipoUsuario { get; set; } = null!;

    [InverseProperty("IdTipoUsuarioNavigation")]
    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}
