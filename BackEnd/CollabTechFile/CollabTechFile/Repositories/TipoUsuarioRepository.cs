using CollabTechFile.DbContextCollab;
using CollabTechFile.Interfaces;
using CollabTechFile.Models;
using CollabTechFile.Utils;
using Microsoft.EntityFrameworkCore;

namespace CollabTechFile.Repositories
{
    public class TipoUsuarioRepository : ITipoUsuarioRepository
    {
        private readonly CollabTechFileContext _context;

        public TipoUsuarioRepository(CollabTechFileContext context)
        {
            _context = context;
        }

        public void Cadastrar(TipoUsuario tipoUsuario)
        {
            try
            {
                _context.TipoUsuarios.Add(tipoUsuario);
                _context.SaveChanges();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<TipoUsuario> Listar()
        {
            try
            {
                return _context.TipoUsuarios.ToList();
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
