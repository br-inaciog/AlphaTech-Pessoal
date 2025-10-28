import React, { useState } from "react";
import "./ModalSalvarDocumento.css";
import voltar from "../../assets/img/Voltar.svg";
import { Link } from "react-router-dom";

const ModalSalvarDocumento = ({ nomeDocumento = "Prazo de entrega ", onCancel, onPublish }) => {
  const [documento, setDocumento] = useState("");

  return (
    <div className="modal-documento-outer">
      <div className="modal-documento-container">
        
        <div className="modalDocumentoHeader">
          <Link
          to="/docAndamentoClie"
            className="modalCDocumentoVoltar" 
            onClick={onCancel}
            aria-label="Voltar"
          >
            <img src={voltar} alt="" />

          </Link>
          <h2 className="modalDocumentoTitulo">
            Nome Documento
          </h2>
          <div style={{ width: "40px" }} />
        </div>

        
        <div className="modalDocumentoDoc">
          {nomeDocumento}
        </div>

        <div className="textoSalvamento">
        <text>Mensagem de Salvamento:</text>
        </div>

        <textarea
          className="modalDocumentoTexto"
          placeholder="Digite suas anotações..."
          value={documento}
          onChange={e => setDocumento(e.target.value)}
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