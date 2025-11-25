using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CollabTechFile.Models;

[Table("Regras_Doc")]
public partial class RegrasDoc
{
    [Key]
    [Column("IdRegras_Doc")]
    public int IdRegrasDoc { get; set; }

    public int? IdRegras { get; set; }

    public int? IdDocumento { get; set; }

    [ForeignKey("IdDocumento")]
    [InverseProperty("RegrasDocs")]
    public virtual Documento? IdDocumentoNavigation { get; set; }

    [ForeignKey("IdRegras")]
    [InverseProperty("RegrasDocs")]
    public virtual Regra? IdRegrasNavigation { get; set; }
}
