using CollabTechFile.DbContextCollab;
using CollabTechFile.Interfaces;
using CollabTechFile.Models;
using Microsoft.EntityFrameworkCore;

namespace CollabTechFile.Repositories
{
    public class ComentarioRepository : IComentarioRepository
    {
        private readonly CollabTechFileContext _context;
        public ComentarioRepository(CollabTechFileContext context)
        {
            _context = context;
        }

        public void Cadastrar(Comentario comentario)
        {
            try
            {
                _context.Comentarios.Add(comentario);
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
                Comentario comentarioBuscado = _context.Comentarios.Find(id)!;
                if (comentarioBuscado != null)
                {
                    _context.Comentarios.Remove(comentarioBuscado);
                }
                _context.SaveChanges();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<Comentario> Listar()
        {
            try
            {
                List<Comentario> listaComentarios = _context.Comentarios.ToList();
                return listaComentarios;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<Comentario> ListarPorDocumento(int idDocumento)
        {
            return _context.Comentarios
                .Where(c => c.IdDocumento == idDocumento)
                .Include(c => c.IdUsuarioNavigation) 
                .OrderByDescending(c => c.DataCriacao)
                .ToList();
        }
    }
}
