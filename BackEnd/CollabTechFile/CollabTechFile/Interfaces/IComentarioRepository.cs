using CollabTechFile.Models;

namespace CollabTechFile.Interfaces
{
    public interface IComentarioRepository
    {
        void Cadastrar(Comentario comentario);
        void Deletar(int id);
        List<Comentario> Listar();

    }
}
