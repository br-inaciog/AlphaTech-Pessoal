using CollabTechFile.DbContextCollab;
using CollabTechFile.Interfaces;
using CollabTechFile.Models;

namespace CollabTechFile.Repositories
{
    public class EmpresaRepository : IEmpresaRepository
    {
        private readonly CollabTechFileContext _context;
        public EmpresaRepository(CollabTechFileContext context)
        {
            _context = context;
        }
        public void Cadastrar(Empresa empresa)
        {
            try
            {
                _context.Empresas.Add(empresa);
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
                Empresa empresaBuscada = _context.Empresas.Find(id)!;
                if (empresaBuscada != null)
                {
                    _context.Empresas.Remove(empresaBuscada);
                }
                _context.SaveChanges();
            }
            catch(Exception)
            {
                throw;
            }
        }

        public List<Empresa> Listar()
        {
            try
            {
                return _context.Empresas.ToList();
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
