using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CollabTechFile.Models;

[Table("Suporte")]
public partial class Suporte
{
    [Key]
    public int IdSuporte { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Nome { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Email { get; set; }

    [Column(TypeName = "text")]
    public string Mensagem { get; set; } = null!;
}
