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
import secureLocalStorage from "react-secure-storage";
import { userDecodeToken } from "../../auth/Auth";

export default function ListagemDoc() {
    const [listagemDoc, setListagemDoc] = useState([]);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [filtro, setFiltro] = useState("Todos");
    const location = useLocation();
    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);
    const statusFiltro = params.get("status");

    const alertar = (icone, mensagem) => {
        Swal.fire({
            icon: icone,
            title: mensagem,
            theme: 'dark',
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
        });
    };

    function verificarEmpresa() {
        const token = secureLocalStorage.getItem("token");

        const tokenDecodificado = userDecodeToken(token);

        console.log(tokenDecodificado);
    }

    async function listarDocumentos() {
        try {
            const [respDocumentos, respVersoes] = await Promise.all([
                api.get("Documentos"),
                api.get("documentoVersoes")
            ]);

            let documentos = respDocumentos.data;
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
            title: "Mover para a lixeira?",
            text: "O documento será inativado.",
            theme: "dark",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.put(`/Documentos/Inativar/${id}`, {
                        novoStatus: "Inativo"
                    });

                    alertar("success", "Ele foi movido para a lixeira.");
                    listarDocumentos();
                } catch (error) {
                    console.error("Erro ao inativar:", error);
                    alertar("error", "Não foi possível inativar o documento.");
                }
            }
        });
    }

    let documentosFiltrados = listagemDoc;

    if (filtro === "Em Andamento") {
        documentosFiltrados = listagemDoc.filter((d) => d.novoStatus === "Em Andamento");
    } else if (filtro === "Assinados") {
        documentosFiltrados = listagemDoc.filter((d) => d.novoStatus === "Assinados");
    } else if (filtro === "Finalizados") {
        documentosFiltrados = listagemDoc.filter((d) => d.novoStatus === "Finalizado");
    }

    async function editarDocumento(doc) {
        const prazoAtual = doc.prazo ? doc.prazo.substring(0, 10) : '';

        try {
            const respEmpresas = await api.get("Empresa");
            const listaEmpresas = respEmpresas.data;

            const empresasOptions = listaEmpresas
                .map(empresa => `<option 
                                value="${empresa.idEmpresa}" 
                                ${empresa.idEmpresa === doc.idEmpresa ? 'selected' : ''}
                             >
                                ${empresa.nome}
                            </option>`)
                .join('');

            const { value } = await Swal.fire({
                title: "Editar Documento",
                html: `
                <label for="nomeDoc" style="margin-top: 10px; display: block;">Nome Documento:</label>
                <input id="nomeDoc" class="swal2-input" placeholder="Nome do Documento" value="${doc.nome || ''}">
                
                <label for="prazoDoc" style="margin-top: 10px; display: block;">Prazo Documento:</label>
                <input id="prazoDoc" class="swal2-input" type="date" value="${prazoAtual}">
                
                <label for="idEmpresa" style="margin-top: 10px; display: block;">Empresa:</label>
                <select id="idEmpresa" class="swal2-select">${empresasOptions}</select>
            `,
                theme: "dark",
                showCancelButton: true,
                confirmButtonText: "Salvar",
                cancelButtonText: "Cancelar",
                focusConfirm: false,
                preConfirm: () => {
                    const nome = document.getElementById("nomeDoc").value;
                    const prazo = document.getElementById("prazoDoc").value;
                    const idEmpresa = document.getElementById("idEmpresa").value; // Pega o ID da empresa selecionada

                    if (!nome || !prazo || !idEmpresa) {
                        Swal.showValidationMessage("Preencha o Nome, Prazo e selecione uma Empresa.");
                        return false;
                    }

                    console.log(nome);
                    console.log(prazo);
                    console.log(idEmpresa);


                    return { nome, prazo, idEmpresa };
                }
            });

            if (value) {
                const dadosAtualizados = {
                    "idDocumento": doc.idDocumento,

                    "idEmpresa": parseInt(value.idEmpresa),
                    "idUsuario": doc.idUsuario,

                    "nome": value.nome,
                    "prazo": value.prazo
                };

                await api.put(`Documentos/${doc.idDocumento}`, dadosAtualizados);

                alertar("success", "O documento foi atualizado.");
                await listarDocumentos();
            }
        } catch (error) {
            console.error("Erro ao editar documento ou buscar empresas:", error);
            alertar("error", "Erro ao editar Documento.");
        }
    }

    const tituloPagina = filtro === "Em Andamento"
        ? "Documentos Em Andamento"
        : filtro === "Assinados"
            ? "Documentos Assinados"
            : filtro === "Finalizado"
                ? "Documentos Finalizado"
                : "Todos os Documentos"
        ;
    function limparFiltro() {
        setFiltro("Todos");
        navigate("/Listagem");
    }

    useEffect(() => {
        listarDocumentos();
        verificarEmpresa();

        if (statusFiltro === "andamento") setFiltro("Em Andamento");
        else if (statusFiltro === "assinado") setFiltro("Assinado");
        else if (statusFiltro === "finalizado") setFiltro("Finalizado");
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
                                <option value="Finalizados">Finalizados</option>
                                <option value="Assinados">Assinados</option>
                            </select>

                            <button className="botaoLimparFiltro" onClick={() => setFiltro("Todos")}>
                                Limpar Filtro
                            </button>
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
                                        to={`/${doc.novoStatus === "Finalizado"
                                            ? "docFinalizadoFunc"
                                            : "docAndamentoFunc"
                                            }/${encodeURIComponent(doc.nome.replaceAll(" ", "-"))}/${doc.idDocumento}`}
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
                                                        excluirDocumento(doc.idDocumento);
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