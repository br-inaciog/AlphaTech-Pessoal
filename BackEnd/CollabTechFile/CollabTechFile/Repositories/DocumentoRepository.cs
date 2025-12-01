using System;
using System.Linq;
using System.Collections.Generic;
using CollabTechFile.DbContextCollab;
using CollabTechFile.Interfaces;
using CollabTechFile.Models;
using Microsoft.EntityFrameworkCore;

namespace CollabTechFile.Repositories
{
    public class DocumentoRepository : IDocumentoRepository
    {
        private readonly CollabTechFileContext _context;

        public DocumentoRepository(CollabTechFileContext context)
        {
            _context = context;
        }

        public void Cadastrar(Documento documento)
        {
            _context.Documentos.Add(documento);
            _context.SaveChanges();
        }

        public void Editar(int id, Documento documento)
        {
            var doc = _context.Documentos.Find(id);

            if (doc != null)
            {
                doc.Nome = documento.Nome ?? doc.Nome;
                doc.Prazo = documento.Prazo ?? doc.Prazo;

                if (documento.Arquivo != null && documento.Arquivo.Length > 0)
                    doc.Arquivo = documento.Arquivo;

                if (!string.IsNullOrEmpty(documento.MimeType))
                    doc.MimeType = documento.MimeType;

                doc.Status = documento.Status;

                // ⭐ Campos que estavam faltando:
                doc.TextoOcr = documento.TextoOcr ?? doc.TextoOcr;
                doc.Versao = documento.Versao;
                doc.VersaoAtual = documento.VersaoAtual;
                doc.AssinadoEm = documento.AssinadoEm ?? doc.AssinadoEm;
                doc.FinalizadoEm = documento.FinalizadoEm ?? doc.FinalizadoEm;
                doc.NovoStatus = documento.NovoStatus ?? doc.NovoStatus;

                _context.SaveChanges();
            }
        }

        public void AtualizarVersao(int id, Documento documentoComNovaVersao)
        {
            var docExistente = _context.Documentos.Find(id);

            if (docExistente != null)
            {
                if (documentoComNovaVersao.VersaoAtual > 0)
                {
                    docExistente.VersaoAtual = documentoComNovaVersao.VersaoAtual;
                }

                _context.SaveChanges();
            }
        }

        public void Deletar(int id)
        {
            var doc = _context.Documentos.Find(id);
            if (doc != null)
            {
                _context.Documentos.Remove(doc);
                _context.SaveChanges();
            }
        }

        public List<Documento> Listar()
        {
            return _context.Documentos
            .AsNoTracking()
            .Include(d => d.UsuarioNavigation)
            .Include(d => d.ReqDocs)
                .ThenInclude(rd => rd.IdRequisitoNavigation)
            .Include(d => d.RegrasDocs)
                .ThenInclude(rg => rg.IdRegrasNavigation)
            .Select(d => new Documento
            {
                IdDocumento = d.IdDocumento,
                IdEmpresa = d.IdEmpresa,
                IdUsuario = d.IdUsuario,

                Nome = d.Nome,
                Prazo = d.Prazo,
                Status = d.Status,
                Versao = d.Versao,
                VersaoAtual = d.VersaoAtual,
                CriadoEm = d.CriadoEm,
                NovoStatus = d.NovoStatus,
                AssinadoEm = d.AssinadoEm,
                FinalizadoEm = d.FinalizadoEm,
                MimeType = d.MimeType,
                TextoOcr = d.TextoOcr,

                UsuarioNavigation = d.UsuarioNavigation,

                // Mapeia ReqDocs e a entidade Requisito vinculada
                ReqDocs = d.ReqDocs.Select(rd => new ReqDoc
                {
                    IdReqDoc = rd.IdReqDoc,
                    IdDocumento = rd.IdDocumento,
                    IdRequisito = rd.IdRequisito,
                    // mapa a navegação do requisito
                    IdRequisitoNavigation = rd.IdRequisitoNavigation == null
                        ? null
                        : new Requisito
                        {
                            IdRequisito = rd.IdRequisitoNavigation.IdRequisito,
                            Tipo = rd.IdRequisitoNavigation.Tipo,
                            TextoReq = rd.IdRequisitoNavigation.TextoReq
                        }
                }).ToList(),

                // Mapeia RegrasDocs e a entidade Regra vinculada
                RegrasDocs = d.RegrasDocs.Select(rg => new RegrasDoc
                {
                    IdRegrasDoc = rg.IdRegrasDoc,
                    IdDocumento = rg.IdDocumento,
                    IdRegras = rg.IdRegras,
                    // mapa a navegação da regra
                    IdRegrasNavigation = rg.IdRegrasNavigation == null
                        ? null
                        : new Regra
                        {
                            IdRegras = rg.IdRegrasNavigation.IdRegras,
                            Nome = rg.IdRegrasNavigation.Nome
                        }
                }).ToList(),

                // NÃO retorna o PDF para não pesar a resposta
                Arquivo = null
            })
            .ToList();
        }

        public Documento BuscarPorIdPdf(int id)
        {
            return _context.Documentos
                .Include(d => d.Comentarios)
                .Include(d => d.UsuarioNavigation)
                .Include(d => d.EmpresaNavigation)
                .FirstOrDefault(x => x.IdDocumento == id);
        }

        public Documento BuscarPorId(int id)
        {
            return _context.Documentos
                .AsNoTracking()
                .Include(d => d.UsuarioNavigation)
                .Include(d => d.EmpresaNavigation)
                .Include(d => d.Comentarios)
                .Include(d => d.DocumentoVersos)
                .Include(d => d.ReqDocs)
                    .ThenInclude(rd => rd.IdRequisitoNavigation)
                .Include(d => d.RegrasDocs)
                    .ThenInclude(rg => rg.IdRegrasNavigation)
                .Select(d => new Documento
                {
                    IdDocumento = d.IdDocumento,
                    IdEmpresa = d.IdEmpresa,
                    IdUsuario = d.IdUsuario,

                    Nome = d.Nome,
                    Prazo = d.Prazo,
                    Status = d.Status,
                    Versao = d.Versao,
                    VersaoAtual = d.VersaoAtual,
                    CriadoEm = d.CriadoEm,
                    NovoStatus = d.NovoStatus,
                    AssinadoEm = d.AssinadoEm,
                    FinalizadoEm = d.FinalizadoEm,
                    MimeType = d.MimeType,
                    TextoOcr = d.TextoOcr,

                    UsuarioNavigation = d.UsuarioNavigation,
                    EmpresaNavigation = d.EmpresaNavigation,

                    Comentarios = d.Comentarios.ToList(),
                    DocumentoVersos = d.DocumentoVersos.ToList(),

                    ReqDocs = d.ReqDocs.Select(rd => new ReqDoc
                    {
                        IdReqDoc = rd.IdReqDoc,
                        IdDocumento = rd.IdDocumento,
                        IdRequisito = rd.IdRequisito,
                        IdRequisitoNavigation = rd.IdRequisitoNavigation == null
                            ? null
                            : new Requisito
                            {
                                IdRequisito = rd.IdRequisitoNavigation.IdRequisito,
                                Tipo = rd.IdRequisitoNavigation.Tipo,
                                TextoReq = rd.IdRequisitoNavigation.TextoReq
                            }
                    }).ToList(),

                    RegrasDocs = d.RegrasDocs.Select(rg => new RegrasDoc
                    {
                        IdRegrasDoc = rg.IdRegrasDoc,
                        IdDocumento = rg.IdDocumento,
                        IdRegras = rg.IdRegras,
                        IdRegrasNavigation = rg.IdRegrasNavigation == null
                            ? null
                            : new Regra
                            {
                                IdRegras = rg.IdRegrasNavigation.IdRegras,
                                Nome = rg.IdRegrasNavigation.Nome
                            }
                    }).ToList(),

                    Arquivo = null
                })
                .FirstOrDefault(d => d.IdDocumento == id);
        }

    }
}
