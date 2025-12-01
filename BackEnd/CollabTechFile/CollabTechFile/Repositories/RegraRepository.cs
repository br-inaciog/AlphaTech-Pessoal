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

        public async Task<bool> DeletarRegraCompletaAsync(int idRegraDoc)
        {
            var regraDoc = await _context.RegrasDocs.FindAsync(idRegraDoc);

            if (regraDoc == null)
                return false;

            var regra = await _context.Regras.FindAsync(regraDoc.IdRegras);

            _context.RegrasDocs.Remove(regraDoc);

            if (regra != null)
                _context.Regras.Remove(regra);

            await _context.SaveChangesAsync();
            return true;
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
