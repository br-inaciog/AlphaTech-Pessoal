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
            const [respDocumentos, respVersoes] = await Promise.all([
                api.get("Documentos"),
                api.get("documentoVersoes")
            ]);

            const documentos = respDocumentos.data;
            const versoes = respVersoes.data;

            const ultimaMensagemPorDocumento = versoes.reduce((acc, versao) => {
                const idDoc = versao.idDocumento;

                if (!acc[idDoc] || versao.idDocumentoVersoes > acc[idDoc].idDocumentoVersoes) {
                    if (versao.mensagem && versao.mensagem.trim() !== '') {
                        acc[idDoc] = {
                            mensagem: versao.mensagem,
                            idDocumentoVersoes: versao.idDocumentoVersoes
                        };
                    }
                }
                return acc;
            }, {});


            const documentosComAnotacao = documentos.map(doc => {
                const ultimaAnotacao = ultimaMensagemPorDocumento[doc.idDocumento];
                return {
                    ...doc,
                    anotacao: ultimaAnotacao ? ultimaAnotacao.mensagem : doc.anotacao
                };
            });

            setListagemDoc(documentosComAnotacao);
        } catch (error) {
            console.error("Erro ao listar documentos ou versões:", error);
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

    let documentosFiltrados = listagemDoc; // Inicia com a lista completa

    if (filtro === "Em Andamento") {
        documentosFiltrados = listagemDoc.filter((d) => d.novoStatus === "Em Andamento");
    } else if (filtro === "Assinados") {
        documentosFiltrados = listagemDoc.filter((d) => d.novoStatus === "Assinados");
    } else if (filtro === "Finalizados") {
        documentosFiltrados = listagemDoc.filter((d) => d.novoStatus === "Finalizados");
    }

    // Define o título dinamicamente
    const tituloPagina = filtro === "Em Andamento"
        ? "Documentos Em Andamento"
        : filtro === "Assinados"
            ? "Documentos Assinados"
            : filtro === "Finalizados"
                ? "Documentos Finalizados"
                : "Todos os Documentos"
        ;

    function limparFiltro() {
        setFiltro("Todos");
        navigate("/Listagem"); // remove o ?status da URL
    }

    useEffect(() => {
        listarDocumentos();

        // Padronizando o filtro da URL com os nomes das options
        if (statusFiltro === "pendente") setFiltro("Em Andamento"); // Corrigido de "Pendentes"
        else if (statusFiltro === "assinado") setFiltro("Assinados");
        else if (statusFiltro === "finalizado") setFiltro("Finalizados");
        else setFiltro("Todos");
    }, [statusFiltro]);

    return (
        <div className="containerGeral">
            <MenuLateral />
            <main className="conteudoPrincipal">
                <section className="areaTrabalho">
                    <Cabecalho />

                    <div className="titulo">
                        <h1>{tituloPagina}</h1>
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
                                            <p>Versão: <span>{doc.versaoAtual || "Sem Versão"}</span></p>
                                            <p>Autor: <span>{doc.usuarioNavigation?.nome || "Autor desconhecido"}</span></p>
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
