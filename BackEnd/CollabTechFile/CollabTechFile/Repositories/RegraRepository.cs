using CollabTechFile.DbContextCollab;
using CollabTechFile.Interfaces;
using CollabTechFile.Models;

namespace CollabTechFile.Repositories
{
    public class RegraRepository : IRegraRepository
    {
        private readonly CollabTechFileContext _context;
        public RegraRepository(CollabTechFileContext context)
        {
            _context = context;
        }
        public void Cadastrar(Regra regra)
        {
            try
            {
                _context.Regras.Add(regra);
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
                Regra regraBuscada = _context.Regras.Find(id)!;
                if (regraBuscada != null)
                {
                    _context.Regras.Remove(regraBuscada);
                }
                _context.SaveChanges();
            }
            catch(Exception) 
            {
                throw;
            }
        }

        public void Editar(int id, Regra regra)
        {
            try
            {
                Regra regraBuscada = _context.Regras.Find(id)!;
                if (regraBuscada != null)
                {
                    regraBuscada.Nome = regra.Nome;
                }
            }
            catch (Exception) 
            {
                throw;
            }
        }

        public List<Regra> Listar()
        {
            try
            {
                List<Regra> listaRegras = _context.Regras.ToList();
                return listaRegras;
            }
            catch 
            {
                throw;            
            }
        }
    }
}
