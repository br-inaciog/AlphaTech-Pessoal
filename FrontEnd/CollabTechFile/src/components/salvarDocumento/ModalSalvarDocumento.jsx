import "./ModalSalvarDocumento.css";
import React, { useState } from "react";
import voltar from "../../assets/img/Voltar.svg";

const ModalSalvarDocumento = ({ nomeDocumento = "Prazo de entrega", onCancel, onPublish }) => {
  const [documento, setDocumento] = useState("");

  return (
    <div className="modal-overlay">
      <div className="modal-documento-container modalAnimado">

        <div className="modalDocumentoHeader">
          <button
            className="modalDocumentoVoltar"
            onClick={onCancel}
            aria-label="Voltar"
          >
            <img src={voltar} alt="Voltar" />
          </button>

          <h2 className="modalDocumentoTitulo">Nome Documento</h2>
          <div style={{ width: "40px" }} />
        </div>

        <div className="modalDocumentoDoc">
          {nomeDocumento}
        </div>

        <div className="textoSalvamento">
          <span>Mensagem de Salvamento:</span>
        </div>

        <textarea
          className="modalDocumentoTexto"
          placeholder="Digite suas anotações..."
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
        />

        <div className="modalDocumentoButtons">
          <button
            className="modalDocumentoCancelar"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="modalDocumentoPublicar"
            onClick={() => onPublish(documento)}
            disabled={!documento.trim()}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSalvarDocumento;