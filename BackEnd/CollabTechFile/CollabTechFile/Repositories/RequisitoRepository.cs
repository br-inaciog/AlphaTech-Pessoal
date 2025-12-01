using CollabTechFile.DbContextCollab;
using CollabTechFile.Interfaces;
using CollabTechFile.Models;

namespace CollabTechFile.Repositories
{
    public class RequisitoRepository : IRequisitoRepository
    {
        private readonly CollabTechFileContext _context;

        public RequisitoRepository(CollabTechFileContext context)
        {
            _context = context;
        }

        public void Cadastrar(Requisito requisito)
        {
            try
            {
                _context.Requisitos.Add(requisito);
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
                Requisito requisitoBuscado = _context.Requisitos.Find(id)!;
                if (requisitoBuscado != null) 
                {
                    _context.Requisitos.Remove(requisitoBuscado);
                }
                _context.SaveChanges();
            }
            catch(Exception) 
            {
                throw;
            }
        }

        public async Task<bool> DeletarRequisitoCompletoAsync(int idRequisitoDoc)
        {
            var reqDoc = await _context.ReqDocs.FindAsync(idRequisitoDoc);

            if (reqDoc == null)
                return false;

            var requisito = await _context.Requisitos.FindAsync(reqDoc.IdRequisito);

            _context.ReqDocs.Remove(reqDoc);

            if (requisito != null)
                _context.Requisitos.Remove(requisito);

            await _context.SaveChangesAsync();
            return true;
        }

        public void Editar(int id, Requisito requisito)
        {
            try
            {
                Requisito requistoBuscado = _context.Requisitos.Find(id)!;
                if(requistoBuscado != null)
                {
                    requistoBuscado.Tipo = requisito.Tipo;
                }
                _context.SaveChanges();
            }
            catch
            {
                throw;
            }
        }

        public List<Requisito> Listar()
        {
            try
            {
                List<Requisito> listaRequisitos = _context.Requisitos.ToList();
                return listaRequisitos;
            }
            catch
            {
                throw;
            }
        }
    }
}
