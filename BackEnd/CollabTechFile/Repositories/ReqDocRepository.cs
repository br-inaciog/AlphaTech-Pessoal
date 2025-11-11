using CollabTechFile.DbContextCollab;
using CollabTechFile.Interfaces;
using CollabTechFile.Models;

namespace CollabTechFile.Repositories
{
    public class ReqDocRepository : IReqDocRepository
    {
        private readonly CollabTechFileContext _context;
        public ReqDocRepository(CollabTechFileContext context)
        {
            _context = context;
        }

        public void Cadastrar(ReqDoc reqDoc)
        {
            try
            {
                _context.ReqDocs.Add(reqDoc);
                _context.SaveChanges();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void Deletar(int id)
        {
            try
            {
                ReqDoc reqDocBuscado = _context.ReqDocs.Find(id)!;
                if (reqDocBuscado != null)
                {
                    _context.ReqDocs.Remove(reqDocBuscado);
                }
                _context.SaveChanges();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void Editar(int id, ReqDoc reqDoc)
        {
            try
            {
                ReqDoc reqDocBuscado = _context.ReqDocs.Find(id)!;
                if (reqDocBuscado != null)
                {
                    reqDocBuscado.IdDocumento = reqDoc.IdDocumento;
                    reqDocBuscado.IdRequisito = reqDoc.IdRequisito;
                } 
                _context.SaveChanges();
            }
            catch
            {
                throw;
            }
        }

        public List<ReqDoc> Listar()
        {
            try
            {
                List<ReqDoc> listaReqDocs = _context.ReqDocs.ToList();
                return listaReqDocs;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}   
