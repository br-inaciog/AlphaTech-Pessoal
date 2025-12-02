import "./InicioCliente.css"

import MenuLateral from "../../components/menuLateral/MenuLateral"
import Cabecalho from "../../components/cabecalho/Cabecalho"

import Pdf from "../../assets/img/PDF.png"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../../services/Service"

export default function InicioCliente() {
    const [listaDoc, setListaDoc] = useState([]);
    const [filtro, setFiltro] = useState("Todos");
    const location = useLocation();
    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);
    const statusFiltro = params.get("status");

    async function listarDocumentos() {
        try {
            const resposta = await api.get("Documentos")
            setListaDoc(resposta.data);
            console.log(resposta.data);
        } catch (error) {
            console.error("Erro ao listar documentos:", error);
        }
    }

    let documentosFiltrados = listaDoc; 

    if (filtro === "Em Andamento") {
        documentosFiltrados = listaDoc.filter((d) => d.novoStatus === "Em Andamento");
    } else if (filtro === "Assinados") {
        documentosFiltrados = listaDoc.filter((d) => d.novoStatus === "Assinados");
    } else if (filtro === "Finalizados") {
        documentosFiltrados = listaDoc.filter((d) => d.novoStatus === "Finalizado");
    }

    // Define o título dinamicamente
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

        if (statusFiltro === "andamento") setFiltro("Em Andamento"); 
        else if (statusFiltro === "assinado") setFiltro("Assinado");
        else if (statusFiltro === "finalizado") setFiltro("Finalizado");
        else setFiltro("Todos");
    }, [statusFiltro]);

    return (
        <div className="containerGeral'">
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
                    </div>

                    <section className="list">
                        {documentosFiltrados.length > 0 ? (
                            documentosFiltrados.map((doc) => (

                                <Link
                                    to={`/${doc.novoStatus === "Finalizado"
                                        ? "docFinalizadoClie"
                                        : "docAndamentoClie"
                                        }/${encodeURIComponent(doc.nome.replaceAll(" ", "-"))}/${doc.idDocumento}`}
                                    className="cardDocumento"
                                >
                                    <img src={Pdf} alt="Icone de Pdf" />
                                    <div className="cardInformacoesCliente">
                                        <h1>{doc.nome || "Sem título"}</h1>
                                        <p>Prazo: <span>{new Date(doc.prazo).toLocaleDateString('pt-BR') || "Sem data"}</span></p>
                                        <p>Versão: <span>{doc.versaoAtual || "Sem Versão"}</span></p>
                                        <p>Autor: <span>{doc.usuarioNavigation?.nome || "Autor desconhecido"}</span></p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p>Nenhum documento encontrado.</p>
                        )}
                    </section>

                </section>
            </main>
        </div>
    )
}