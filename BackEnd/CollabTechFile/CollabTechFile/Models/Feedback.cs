using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CollabTechFile.Models;

[Table("Feedback")]
public partial class Feedback
{
    [Key]
    public int IdFeedback { get; set; }

    public int IdUsuario { get; set; }

    [Column("mensagem", TypeName = "text")]
    public string Mensagem { get; set; } = null!;

    [Column("data_envio", TypeName = "datetime")]
    public DateTime? DataEnvio { get; set; }

    [ForeignKey("IdUsuario")]
    [InverseProperty("Feedbacks")]
    public virtual Usuario IdUsuarioNavigation { get; set; } = null!;
}
