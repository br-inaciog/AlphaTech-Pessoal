import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./modalComentarioCliente.css";
import voltar from "../../assets/img/Voltar.svg";
import { Link } from "react-router-dom";

const ModalComentarioCliente = ({
  nomeDocumento = "Nome do Documento",
  aoCancelar,
  aoPublicar,
  aberto
}) => {
  const [comentario, setComentario] = useState("");

  if (!aberto) return null;

  const aoClicarFora = (e) => {
    if (e.target.classList.contains("fundoModalComentario")) {
      aoCancelar();
    }
  };

  return ReactDOM.createPortal(
    <div
      className="fundoModalComentario"
      onClick={aoClicarFora}
    >
      <div className="modalComentarioExterno">
        <div className="modalComentarioContainer">
          <div className="modalComentarioCabecalho">
            <button
              className="modalComentarioVoltar"
              onClick={aoCancelar}
              aria-label="Voltar"
            >
              <img src={voltar} alt="Voltar" />
            </button>
            <h2 className="modalComentarioTitulo">
              Comentário
            </h2>
            <div style={{ width: "40px" }} />
          </div>
          <div className="modalComentarioDocumento">
            {nomeDocumento}
          </div>
          <textarea
            className="modalComentarioTexto"
            placeholder="Digite seu comentário..."
            value={comentario}
            onChange={e => setComentario(e.target.value)}
          />
          <div className="modalComentarioBotoes">
            <button
              className="modalComentarioCancelar"
              onClick={aoCancelar}
            >
              Cancelar
            </button>
            <button
              className="modalComentarioPublicar"
              onClick={() => aoPublicar(comentario)}
              disabled={!comentario.trim()}
            >
              Publicar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalComentarioCliente;