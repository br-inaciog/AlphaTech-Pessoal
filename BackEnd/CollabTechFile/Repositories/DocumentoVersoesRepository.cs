using CollabTechFile.Models;
using CollabTechFile.DbContextCollab;
using CollabTechFile.Interfaces;
using System.Collections.Generic;
using System.Linq;


namespace CollabTechFile.Repositories
{
    public class DocumentoVersoesRepository : IDocumentoVersoesRepository
    {
        private readonly CollabTechFileContext _context;

        public DocumentoVersoesRepository(CollabTechFileContext context)
        {
            _context = context;
        }

        public void Cadastrar(DocumentoVersoes versao)
        {
            _context.DocumentoVersoes.Add(versao);
            _context.SaveChanges();
        }

        public void Editar(DocumentoVersoes versao)
        {
            _context.DocumentoVersoes.Update(versao);
            _context.SaveChanges();
        }

        public List<DocumentoVersoes> Listar()
        {
            return _context.DocumentoVersoes
                .OrderByDescending(v => v.NumeroVersao)
                .ToList();
        }

        public List<DocumentoVersoes> ListarPorDocumento(int IdDocumento)
        {
            return _context.DocumentoVersoes
                .Where(v => v.IdDocumento == IdDocumento)
                .OrderByDescending(v => v.NumeroVersao)
                .ToList();
        }

      
    }
}
