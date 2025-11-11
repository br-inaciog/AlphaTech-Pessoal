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
                usuario.Senha = Criptografia.GerarHash(usuario.Senha!);

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

                // Se quiser alterar a senha, recripte-a
                if (!string.IsNullOrEmpty(usuario.Senha))
                    usuarioBuscado.Senha = Criptografia.GerarHash(usuario.Senha);

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
                return _context.Usuarios.ToList();
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
                // Inclui o relacionamento com TipoUsuario
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
            return _context.Usuarios.FirstOrDefault(u => u.Email == email)!;
        }

        public Usuario BuscarPorId(int id, Usuario usuario)
        {
            return _context.Usuarios.FirstOrDefault(u => u.IdUsuario == id);
        }

        public void BuscarPorId(int IdUsuario)
        {
            throw new NotImplementedException();
        }
    }
}
