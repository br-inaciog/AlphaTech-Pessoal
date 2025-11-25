using CollabTechFile.Models;

namespace CollabTechFile.Interfaces
{
    public interface IReqDocRepository
    {
        void Cadastrar(ReqDoc reqDoc);
        void Deletar(int id);
        void Editar(int id, ReqDoc reqDoc);
        List<ReqDoc> Listar();
    }
}
