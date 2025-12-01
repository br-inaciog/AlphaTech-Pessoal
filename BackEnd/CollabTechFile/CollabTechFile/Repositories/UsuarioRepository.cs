using CollabTechFile.Interfaces;
using CollabTechFile.Models;
using CollabTechFile.DbContextCollab;
using CollabTechFile.Utils;
using Microsoft.EntityFrameworkCore;

namespace CollabTechFile.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly CollabTechFileContext _context;

        public UsuarioRepository(CollabTechFileContext context)
        {
            _context = context;
        }
        public void Cadastrar(Usuario usuario)
        {
            try
            {
                string senhaPadrao = "Senai@12";

                usuario.Senha = Criptografia.GerarHash(senhaPadrao);

                _context.Usuarios.Add(usuario);

                _context.SaveChanges();
            }
            catch (Exception)
            {
                throw;
            }
        }

        //public void Deletar(int id)
        //{
        //    try
        //    {
        //        Usuario usuarioBuscado = _context.Usuarios.Find(id)!;
        //        if (usuarioBuscado != null)
        //        {
        //            _context.Usuarios.Remove(usuarioBuscado);
        //        }
        //        _context.SaveChanges();
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }
        //}

        public void Editar(int id, Usuario usuario)
        {
            try
            {
                Usuario usuarioBuscado = _context.Usuarios.Find(id)!;

                if (usuarioBuscado == null)
                    throw new Exception("Usuário não encontrado.");

                // 🔹 Atualize apenas os campos que podem ser alterados
                usuarioBuscado.Nome = usuario.Nome;
                usuarioBuscado.Email = usuario.Email;

                if (!string.IsNullOrEmpty(usuario.Senha))
                    usuarioBuscado.Senha = usuario.Senha; // já está hashada


                usuarioBuscado.Ativo = usuario.Ativo;

                _context.Usuarios.Update(usuarioBuscado);
                _context.SaveChanges();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<Usuario> Listar()
        {
            try
            {
                return _context.Usuarios
                    .Include(u => u.EmpresaNavigation)     
                    .Include(u => u.IdTipoUsuarioNavigation) 
                    .ToList();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public Usuario BuscarPorEmailESenha(string email, string senha)
        {
            try
            {
                Usuario usuarioBuscado = _context.Usuarios
                    .Include(u => u.IdTipoUsuarioNavigation)
                    .FirstOrDefault(u => u.Email == email)!;

                if (usuarioBuscado != null)
                {
                    bool confere = Criptografia.CompararHash(senha, usuarioBuscado.Senha!);

                    if (confere)
                    {
                        return usuarioBuscado;
                    }
                }
                return null!;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public Usuario BuscarPorEmail(string email)
        {
            return _context.Usuarios
                .Include(u => u.IdTipoUsuarioNavigation)
                .Include(u => u.EmpresaNavigation)
                .AsNoTracking() 
                .FirstOrDefault(u => u.Email == email)!;
        }

        public Usuario BuscarPorId(int id)
        {
            return _context.Usuarios.FirstOrDefault(u => u.IdUsuario == id)!;
        }
    }
}
