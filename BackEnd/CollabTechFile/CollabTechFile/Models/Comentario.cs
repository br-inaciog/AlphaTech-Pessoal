using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CollabTechFile.Models;

[Table("Comentario")]
public partial class Comentario
{
    [Key]
    public int IdComentario { get; set; }

    public int? IdUsuario { get; set; }

    public int? IdDocumento { get; set; }

    [Column("texto")]
    [StringLength(2000)]
    [Unicode(false)]
    public string? Texto { get; set; }

    [ForeignKey("IdDocumento")]
    [InverseProperty("Comentarios")]
    public virtual Documento? IdDocumentoNavigation { get; set; }

    [ForeignKey("IdUsuario")]
    [InverseProperty("Comentarios")]
    public virtual Usuario? IdUsuarioNavigation { get; set; }
}
