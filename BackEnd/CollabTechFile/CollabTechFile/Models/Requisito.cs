using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CollabTechFile.Models;

public partial class Requisito
{
    [Key]
    public int IdRequisito { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? Tipo { get; set; }

    [StringLength(250)]
    [Unicode(false)]
    public string? TextoReq { get; set; }

    [InverseProperty("IdRequisitoNavigation")]
    public virtual ICollection<ReqDoc> ReqDocs { get; set; } = new List<ReqDoc>();
}
