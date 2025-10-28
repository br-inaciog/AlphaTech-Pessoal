import React from 'react';
import ReactDOM from 'react-dom';
import './ModalFiltroFuncionario.css';
import calendario from '../../assets/img/Calendario.svg';
import modalVoltar from '../../assets/img/Voltar.svg';

export default function ModalFiltroFuncionario({ onClose, aberto = true }) {
    if (!aberto) return null;

    const aoClicarFora = (e) => {
        if (e.target.classList.contains("modalSobreposicao")) {
            onClose();
        }
    };

    return ReactDOM.createPortal(
        <div className="modalSobreposicao" onClick={aoClicarFora}>
            <div className="modalContainer">
                <div className="modalHeader">
                    <span className="modalVoltar" onClick={onClose}>
                        <img src={modalVoltar} alt="" />
                    </span>
                    <h2 className="modalTitulo">Filtros</h2>
                </div>
                <hr className="modalDivisor" />
                <form className="modalForm">
                    <div className="modalRow">
                        <div className="modalField">
                            <label className="modalLabel">Empresa</label>
                            <select className="modalInput">
                                <option>Selecione</option>
                                <option>Empresa 1</option>
                                <option>Empresa 2</option>
                            </select>
                        </div>
                        <div className="modalField">
                            <label className="modalLabel">Cliente</label>
                            <input className="modalInput" type="text" placeholder="Digite o nome do cliente" />
                        </div>
                        <div className="modalField">
                            <label className="modalLabel">Prazo</label>
                            <div className="modalInputIcone">
                                <span role="img" aria-label="calendario" style={{marginRight: 8}} >
                                    <img src={calendario} alt="" />
                                </span>
                                <input className="modalInput" type="text" placeholder="00/00/0000" />
                            </div>
                        </div>
                    </div>
                    <div className="modalField" style={{marginTop: 24, width: '100%'}}>
                        <label className="modalLabel">Documento</label>
                        <input className="modalInput" type="text" placeholder="Digite o documento" />
                    </div>
                </form>
                <div className="modalDocumentos">
                    <h3 className="modalDocumentosTitulo">Documento disponível para alta</h3>
                    <table className="modalTabela">
                        <thead>
                            <tr>
                                <th>Empresa</th>
                                <th>Cliente</th>
                                <th>Documento</th>
                                <th>Prazo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Empresa</td>
                                <td>Cliente</td>
                                <td>Documento</td>
                                <td>25/10/2025</td>
                            </tr>
                            <tr>
                                <td>Empresa</td>
                                <td>Cliente</td>
                                <td>Documento</td>
                                <td>25/10/2025</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>,
        document.body
    );
}