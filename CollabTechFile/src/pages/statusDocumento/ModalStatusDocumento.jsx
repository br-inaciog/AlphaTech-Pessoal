import React from 'react';
import visualizar from '../../assets/img/Olho.png'
import arquivo from '../../assets/img/Download.png'
import voltar from '../../assets/img/Voltar.svg'
import './ModalStatusDocumento.css';

const documentos = [
  { nome: 'Contrato 2024', data: '23/04/2023' },
  { nome: 'Contrato 2024', data: '23/04/2023' },
  { nome: 'Contrato 2024', data: '23/04/2023' },
  { nome: 'Contrato 2024', data: '23/04/2023' },
];
  
export default function ModalStatusDocumento({ aoFechar }) {
  return (
    <div className="modalStatusContainer">
      <div className="modalStatusCabecalho">
        <button className="modalStatusVoltar" onClick={aoFechar}>
          <img src={voltar} alt="" />
        </button>
        <h2>Status dos Documentos</h2>
      </div>
      <div className="modalStatusAbas">
        <button className="aba abaPendentes ativa">Pendentes</button>
        <button className="aba abaAssinados">Assinados</button>
        <button className="aba abaFinalizados">Finalizados</button>
      </div>
      <div className="modalStatusLista">
        {documentos.map((doc, idx) => (
          <div className="modalStatusItem" key={idx}>
            <div>
              <div className="modalStatusNome">{doc.nome}</div>
              <div className="modalStatusData">{doc.data}</div>
            </div>
            <div className="modalStatusAcoes">
              <button className="acaoBtn">
                <span role="img" aria-label="visualizar"><img src={visualizar} alt="" /></span>
              </button>
              <button className="acaoBtn">
                <span role="img" aria-label="baixar"><img src={arquivo} alt="" /></span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}