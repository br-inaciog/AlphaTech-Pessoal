using CollabTechFile.Models;

namespace CollabTechFile.Interfaces
{
    public interface IEmpresaRepository
    {
        List<Empresa> Listar();
        void Cadastrar(Empresa empresa);
        void Deletar(int id);

    }
}
