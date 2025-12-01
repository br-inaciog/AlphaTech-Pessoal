import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./modalComentarioCliente.css";
import voltar from "../../assets/img/Voltar.svg";

export default function ModalComentarioCliente({
  nomeDocumento = "Nome do Documento",
  aberto,
  aoCancelar,
  aoPublicar
}) {
  const [comentario, setComentario] = useState("");

  if (!aberto) return null;

  const aoClicarFora = (e) => {
    if (e.target.classList.contains("fundoModalComentario")) {
      aoCancelar();
    }
  };

  return ReactDOM.createPortal(
    <div className="fundoModalComentario" onClick={aoClicarFora}>
      <div className="modalComentarioContainer">

        {/* Cabeçalho */}
        <div className="modalComentarioCabecalho">
          <button
            type="button"
            className="modalComentarioVoltar"
            onClick={aoCancelar}
          >
            <img src={voltar} alt="Voltar" />
          </button>

          <h2 className="modalComentarioTitulo">Comentário</h2>

          {/* Espaço pra alinhar */}
          <div style={{ width: "40px" }} />
        </div>

        {/* Nome do Documento */}
        <div className="modalComentarioDocumento">{nomeDocumento}</div>

        {/* Campo de texto */}
        <textarea
          className="modalComentarioTexto"
          placeholder="Digite seu comentário..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />

        {/* Botões */}
        <div className="modalComentarioBotoes">
          <button
            type="button"
            className="modalComentarioCancelar"
            onClick={aoCancelar}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="modalComentarioPublicar"
            disabled={!comentario.trim()}
            onClick={() => {
              aoPublicar(comentario);
              setComentario("");
            }}
          >
            Publicar
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
