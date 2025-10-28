import "./ListagemDoc.css";
import api from "../../services/Service";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import MenuLateral from "../../components/menuLateral/MenuLateral";
import Cabecalho from "../../components/cabecalho/Cabecalho";
import Lixeira from "../../assets/img/Lixeira.png";
import Pdf from "../../assets/img/PDF.png";
import Editar from "../../assets/img/Editar.png";
import Excluir from "../../assets/img/Delete.svg";

export default function ListagemDoc() {
    const [listagemDoc, setListagemDoc] = useState([]);
    const [hoverIndex, setHoverIndex] = useState(null);

    // Função para buscar documentos da API
    async function listarDocumentos() {
        try {
            const resposta = await api.get("Documentos");
            setListagemDoc(resposta.data);
            console.log(resposta.data);
        } catch (error) {
            console.error("Erro ao listar documentos:", error);
        }
    }

    useEffect(() => {
        listarDocumentos();
    }, []);

    return (
        <div className="containerGeral">
            <MenuLateral />
            <main className="conteudoPrincipal">
                <section className="areaTrabalho">
                    <Cabecalho />

                    <div className="titulo">
                        <h1>Documentos</h1>
                    </div>

                    <div className="botaoFiltraLixeira">
                        <div className="botaoFiltrar">
                            <select defaultValue="">
                                <option value="" disabled>Filtrar</option>
                                <option value="Pendentes">Pendentes</option>
                                <option value="Assinados">Assinados</option>
                                <option value="Finalizados">Finalizados</option>
                            </select>
                        </div>

                        <Link className="botaoLixeiraList" to="/Lixeira">
                            <img src={Lixeira} alt="Lixeira" />
                            <p>Excluídos</p>
                        </Link>
                    </div>

                    <section className="list">
                        {listagemDoc.length > 0 ? (
                            listagemDoc.map((doc, index) => (
                                <div
                                    key={index}
                                    className="cardContainer"
                                    onMouseEnter={() => setHoverIndex(index)}
                                    onMouseLeave={() => setHoverIndex(null)}
                                >
                                    <Link to={`/docAndamentoFunc/${doc.idDocumento}`} className="cardDocumento">
                                        <img src={Pdf} alt="Icone de Pdf" />
                                        <div className="cardInformacoes">
                                            <h1>{doc.nome || "Sem título"}</h1>
                                            <p>{new Date(doc.criadoEm).toLocaleDateString('pt-BR') || "Sem data"} — {doc.idUsuarioNavigation?.nome || "Autor desconhecido"}</p>
                                            <p>Versão: <span>{doc.versao || "Sem Versão"}</span></p>
                                        </div>

                                        <div className="cardAcoes">
                                            <div className="infAcoes">
                                                <img src={Editar} alt="Editar" />
                                            </div>
                                            <div className="infAcoes">
                                                <img src={Excluir} alt="Excluir" />
                                            </div>
                                        </div>
                                    </Link>

                                    {hoverIndex === index && (
                                        <div className="mensagemDoc show">
                                            <p className="tituloMensagem">Anotações:</p>
                                            <p>{doc.anotacao || "Mensagem escrita pelo proprietário..."}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>Nenhum documento encontrado.</p>
                        )}
                    </section>
                </section>
            </main>
        </div>
    );
}