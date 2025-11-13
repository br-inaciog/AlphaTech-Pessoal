using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CollabTechFile.Models;

public partial class Regra
{
    [Key]
    public int IdRegras { get; set; }

    [Column("nome")]
    [StringLength(200)]
    [Unicode(false)]
    public string? Nome { get; set; }

    [InverseProperty("IdRegrasNavigation")]
    public virtual ICollection<RegrasDoc> RegrasDocs { get; set; } = new List<RegrasDoc>();
}
