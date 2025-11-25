import "./ListagemDoc.css";
import api from "../../services/Service";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import MenuLateral from "../../components/menuLateral/MenuLateral";
import Cabecalho from "../../components/cabecalho/Cabecalho";
import Pdf from "../../assets/img/PDF.png";
import Editar from "../../assets/img/Editar.png";
import Excluir from "../../assets/img/Delete.svg";
import Swal from "sweetalert2";

export default function ListagemDoc() {
    const [listagemDoc, setListagemDoc] = useState([]);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [filtro, setFiltro] = useState("Todos");
    const location = useLocation();
    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);
    const statusFiltro = params.get("status");

    async function listarDocumentos() {
        try {
            const resposta = await api.get("Documentos");
            setListagemDoc(resposta.data);
            console.log(resposta.data);
        } catch (error) {
            console.error("Erro ao listar documentos:", error);
        }
    }

    async function excluirDocumento(id) {
        Swal.fire({
            title: "Excluir documento?",
            text: "O documento irá para a lixeira.",
            theme: "dark",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, excluir!",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.preventDefault(`/Documentos/${id.idDocumento}`);
                    Swal.fire("Excluído!", "O documento foi enviado para a lixeira.", "success");
                    listarDocumentos();
                } catch (error) {
                    console.error("Erro ao excluir:", error);
                    Swal.fire("Erro!", "Não foi possível excluir o documento.", "error");
                }
            }
        });
    }

    useEffect(() => {
        listarDocumentos();

        if (statusFiltro === "Em Andamento") setFiltro("Em Andamento");
        else if (statusFiltro === "Assinado") setFiltro("Assinados");
        else if (statusFiltro === "Finalizado") setFiltro("Finalizados");
        else setFiltro("Todos");
    }, [statusFiltro]);

    let documentosFiltrados = listagemDoc;

    if (filtro === "Em Andamento") {
        documentosFiltrados = listagemDoc.filter((d) => d.novoStatus === "Em Andamento");
    } else if (filtro === "Assinados") {
        documentosFiltrados = listagemDoc.filter((d) => d.assinadoEm !== null);
    } else if (filtro === "Finalizados") {
        documentosFiltrados = listagemDoc.filter((d) => d.status === true);
    }

    const tituloPagina = filtro === "Pendentes"
        ? "Documentos Em Andamento"
        : filtro === "Assinados"
            ? "Documentos Assinados"
            : filtro === "Finalizados"
                ? "Documentos Finalizados"
                : "Todos os Documentos"
        ;

    function limparFiltro() {
        setFiltro("Todos");
        navigate("/Listagem");
    }

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
                            <select
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}
                            >
                                <option value="Todos">Todos</option>
                                <option value="Em Andamento">Em Andamento</option>
                                <option value="Assinados">Assinados</option>
                                <option value="Finalizados">Finalizados</option>
                            </select>

                            <button className="botaoLimparFiltro" onClick={() => setFiltro("Todos")}>
                                Limpar Filtro
                            </button>

                            {/* Botão de limpar filtro
                            <button
                                onClick={limparFiltro}
                                className="botaoLimpar"
                            >
                                Limpar filtro
                            </button> */}
                        </div>

                        <Link className="botaoLixeiraList" to="/Lixeira">
                            <p>Excluídos</p>
                        </Link>
                    </div>

                    <section className="list">
                        {documentosFiltrados.length > 0 ? (
                            documentosFiltrados.map((doc, index) => (
                                <div
                                    key={index}
                                    className="cardContainer"
                                    onMouseEnter={() => setHoverIndex(index)}
                                    onMouseLeave={() => setHoverIndex(null)}
                                >
                                        <Link
                                            to={`/docAndamentoFunc/${encodeURIComponent(doc.nome.replaceAll(" ", "-"))}/${doc.idDocumento}`}
                                            className="cardDocumento"
                                        >
                                        <img src={Pdf} alt="Icone de Pdf" />
                                        <div className="cardInformacoes">
                                            <h1>{doc.nome || "Sem título"}</h1>
                                            <p>Prazo: <span>{new Date(doc.criadoEm).toLocaleDateString('pt-BR') || "Sem data"}</span></p>
                                            <p>Versão: <span>{doc.versao || "Sem Versão"}</span></p>
                                            <p>Autor: <span>{doc.idUsuarioNavigation?.nome || "Autor desconhecido"}</span></p>
                                        </div>

                                        <div className="cardAcoes">
                                            <div className="infAcoes">
                                                <img src={Editar} alt="Editar" />
                                            </div>

                                            <div className="infAcoes">
                                                <img
                                                    src={Excluir}
                                                    alt="Excluir"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        excluirDocumento(doc.id);
                                                    }}
                                                    style={{ cursor: "pointer" }}
                                                />
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
