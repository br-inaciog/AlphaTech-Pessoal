using CollabTechFile.Models;
using System.Collections.Generic;

namespace CollabTechFile.Interfaces
{
    public interface IDocumentoVersoesRepository
    {
        void Cadastrar(DocumentoVersoes versao);

        void Editar(DocumentoVersoes versao);

        List<DocumentoVersoes> Listar();

        List<DocumentoVersoes> ListarPorDocumento(int IdDocumento);

    }
}
