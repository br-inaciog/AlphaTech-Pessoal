using CollabTechFile.Models;

namespace CollabTechFile.Interfaces
{
    public interface IDocumentoRepository
    {
        void Cadastrar(Documento documento);
        void Editar(int id, Documento documento);
        void Deletar(int id);
        Documento BuscarPorIdPdf(int id);
        Documento BuscarPorId(int id);
        List<Documento> Listar();
        void AtualizarVersao(int id, Documento documento);
    }
}
