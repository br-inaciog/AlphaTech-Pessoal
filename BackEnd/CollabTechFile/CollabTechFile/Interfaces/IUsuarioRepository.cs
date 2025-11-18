using CollabTechFile.Models;

namespace CollabTechFile.Interfaces
{
    public interface IUsuarioRepository
    {
        void Cadastrar(Usuario usuario);

        List<Usuario> Listar();

        void Editar(int id, Usuario usuario);

        Usuario BuscarPorId(int id);

        Usuario BuscarPorEmailESenha(string email, string senha);

        Usuario BuscarPorEmail(string email);


        //void Deletar(int id);
    }
}