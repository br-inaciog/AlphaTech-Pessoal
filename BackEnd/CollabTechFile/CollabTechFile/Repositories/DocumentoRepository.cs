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

                if (documento.IdUsuario.HasValue)
                    doc.IdUsuario = documento.IdUsuario;

                if (documento.IdEmpresa.HasValue)
                    doc.IdEmpresa = documento.IdEmpresa;

                if (documento.Arquivo != null && documento.Arquivo.Length > 0)
                    doc.Arquivo = documento.Arquivo;

                if (!string.IsNullOrEmpty(documento.MimeType))
                    doc.MimeType = documento.MimeType;

                doc.Status = documento.Status;

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
                .ThenInclude(u => u.EmpresaNavigation) 
                .Include(d => d.EmpresaNavigation)
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
                .Include(d => d.UsuarioNavigation)
                .ThenInclude(u => u.EmpresaNavigation) 
                .Include(d => d.EmpresaNavigation)
                .Include(d => d.Comentarios)
                .Include(d => d.DocumentoVersos)
                .FirstOrDefault(d => d.IdDocumento == id);
        }

    }
}
