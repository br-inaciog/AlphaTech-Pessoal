using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CollabTechFile.Models;

[Table("Req_Doc")]
public partial class ReqDoc
{
    [Key]
    [Column("IdReq_Doc")]
    public int IdReqDoc { get; set; }

    public int? IdRequisito { get; set; }

    public int? IdDocumento { get; set; }

    [ForeignKey("IdDocumento")]
    [InverseProperty("ReqDocs")]
    public virtual Documento? IdDocumentoNavigation { get; set; }

    [ForeignKey("IdRequisito")]
    [InverseProperty("ReqDocs")]
    public virtual Requisito? IdRequisitoNavigation { get; set; }
}
