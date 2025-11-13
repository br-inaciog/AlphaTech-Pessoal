using CollabTechFile.Models;

namespace CollabTechFile.Interfaces
{
    public interface IRegrasDocRepository
    {
        void Cadastrar(RegrasDoc regrasDoc);
        void Deletar(int id);
        void Editar(int id, RegrasDoc regrasDoc);
        List<RegrasDoc> Listar();

    }
}
