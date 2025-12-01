using CollabTechFile.Models;

namespace CollabTechFile.Interfaces
{
    public interface IRequisitoRepository
    {
        void Cadastrar (Requisito requisito);
        void Deletar (int id);
        void Editar(int id, Requisito requisito);
        List<Requisito> Listar ();
        public Task<bool> DeletarRequisitoCompletoAsync(int idRequisitoDoc);
    }
}
