import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './ModalFiltroFuncionario.css';
import modalVoltar from '../../assets/img/Voltar.svg';

export default function ModalFiltroFuncionario({ onClose, aberto = true, empresas = [], onAplicarFiltros }) {
    const [filtros, setFiltros] = useState({
        empresa: '',
        nome: ''
    });

    useEffect(() => {
        if (aberto) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => (document.body.style.overflow = 'auto');
    }, [aberto]);

    if (!aberto) return null;

    const aoClicarFora = (e) => {
        if (e.target.classList.contains("modalSobreposicao")) {
            onClose();
        }
    };

    const handleInputChange = (campo, valor) => {
        setFiltros(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    const aplicarFiltros = (e) => {
        e.preventDefault();
        onAplicarFiltros?.(filtros);
    };

    const limparFiltros = () => {
        setFiltros({ empresa: '', nome: '' });
    };

    return ReactDOM.createPortal(
        <div className="modalSobreposicao" onClick={aoClicarFora}>
            <div className="modalContainer modalAnimado">
                <div className="modalHeader">
                    <span className="modalVoltar" onClick={onClose}>
                        <img src={modalVoltar} alt="Voltar" />
                    </span>
                    <h2 className="modalTitulo">Filtrar Funcionários</h2>
                </div>
                <hr className="modalDivisor" />

                <form className="modalForm" onSubmit={aplicarFiltros}>
                    <div className="modalRow">
                        <div className="modalField">
                            <label className="modalLabel">Empresa</label>
                            <select
                                className="modalInput"
                                value={filtros.empresa}
                                onChange={(e) => handleInputChange('empresa', e.target.value)}
                            >
                                <option value="">Selecione uma empresa</option>
                                {empresas.map(empresa => (
                                    <option key={empresa.idEmpresa} value={empresa.nome}>
                                        {empresa.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="modalField">
                            <label className="modalLabel">Nome do Funcionário</label>
                            <input
                                className="modalInput"
                                type="text"
                                placeholder="Digite o nome do funcionário"
                                value={filtros.nome}
                                onChange={(e) => handleInputChange('nome', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="modalAcoes">
                        <button type="button" onClick={limparFiltros} className="btnCinza">
                            Limpar
                        </button>
                        <button type="submit" className="btnAzul">
                            Aplicar Filtros
                        </button>
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
                        </tbody>
                    </table>
                </div>
            </div>
        </div>,
        document.body
    );
}
