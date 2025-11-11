using CollabTechFile.Models;

namespace CollabTechFile.Interfaces
{
    public interface IRegraRepository
    {
        void Cadastrar(Regra regra);
        void Deletar(int id);
        void Editar(int id, Regra regra);
        List<Regra> Listar();
    }
}
