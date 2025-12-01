import "./docFinalizadoClie.css"

import MenuLateral from "../../components/menuLateral/MenuLateral"
import Cabecalho from "../../components/cabecalho/Cabecalho"

import Assinatura from "../../assets/img/Assinatura.png"
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import api from "../../services/Service";

export default function DocFinalizadoClie() {
    const { nomeDocumento, idDocumento } = useParams();
    const nomeCorrigido = nomeDocumento.replaceAll("-", " ");

    const [documentoAtual, setDocumentoAtual] = useState(null);
    const [reqFuncionais, setReqFuncionais] = useState([]);
    const [reqNaoFuncionais, setReqNaoFuncionais] = useState([]);

    const [documentoInfo, setDocumentoInfo] = useState(null);

    async function buscarDocumento() {
        try {
            const resposta = await api.get(`Documentos/${idDocumento}`);
            const doc = resposta.data;

            const nomeEmpresa = doc.empresaNavigation ? doc.empresaNavigation.nome : "Empresa não informada";

            setDocumentoInfo({
                versaoAtual: doc.versaoAtual,
                prazo: doc.prazo,
                empresa: nomeEmpresa,
            });
        } catch (error) {
            console.error("Erro ao buscar informações do documento:", error);
        }
    }

    async function buscarDadosDocumento() {
        try {
            const response = await api.get(`/Documentos/${idDocumento}`);
            const dados = response.data;

            setDocumentoAtual(dados);

            const reqs = dados.reqDocs || [];

            const funcionais = reqs.filter(req =>
                req.idRequisitoNavigation?.tipo?.toUpperCase().startsWith("RF") &&
                !req.idRequisitoNavigation.tipo.toUpperCase().includes("RNF")
            );

            const naoFuncionais = reqs.filter(req =>
                req.idRequisitoNavigation?.tipo?.toUpperCase().startsWith("RNF")
            );

            setReqFuncionais(funcionais);
            setReqNaoFuncionais(naoFuncionais);

        } catch (error) {
            console.log("Erro ao buscar documento:", error);
        }
    }

    useEffect(() => {
        buscarDadosDocumento();
        buscarDocumento();
    }, []);

    return (
        <div className="containerGeral'">
            <MenuLateral />
            <main className="conteudoPrincipal">
                <section className="areaTrabalho">
                    <Cabecalho />

                    <section className="docAndamento">
                        <div className="titulo">
                            <h1>Documento em Andamento</h1>
                        </div>

                        <div className="documento">
                            <div className="nomeDoc">
                                <p>Nome: <span>{nomeCorrigido}</span></p>
                            </div>

                            <div className="infDocumento">
                                <div className="botaoSelectRementente">
                                    <label>Rementente:</label>
                                    <span>{documentoInfo?.empresa}</span>
                                </div>

                                <div className="prazoEntrega">
                                    <label>Prazo:</label>
                                    <span>{documentoInfo?.prazo}</span>
                                </div>

                                <div className="botaoFiltrarVersoesDoc">
                                    <p>Versão Atual:</p>
                                    <span>{documentoInfo?.versaoAtual}</span>
                                </div>
                            </div>

                            <div className="regrasDeNegocio">
                                <div className="tituloRN">
                                    <h2>Regras de Negócio</h2>
                                </div>
                                <section>
                                    {documentoAtual?.regrasDocs && documentoAtual.regrasDocs.length > 0 ? (
                                        documentoAtual.regrasDocs.map((regra, index) => (
                                            <div className="listaRN" key={regra.idRegrasDoc}>
                                                <p>
                                                    <span className="tagListaRnRnfRf">
                                                        RN{String(index + 1).padStart(2, "0")}:
                                                    </span>
                                                    {regra.idRegrasNavigation?.nome}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="listaRN">
                                            <p>Nenhuma Regra de Negócio.</p>
                                        </div>
                                    )}
                                </section>
                            </div>

                            <div className="requisitosFuncionais">
                                <div className="tituloRF">
                                    <h2>Requisitos Funcionais</h2>
                                </div>
                                <section>
                                    {reqFuncionais.length > 0 ? (
                                        reqFuncionais.map((rf, index) => (
                                            <div className="listaRF" key={rf.idReqDoc}>
                                                <p>
                                                    <span className="tagListaRnRnfRf">
                                                        RF{String(index + 1).padStart(2, "0")}:
                                                    </span>
                                                    {rf.idRequisitoNavigation.textoReq}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="listaRF">
                                            <p>Nenhum RF cadastrado.</p>
                                        </div>
                                    )}
                                </section>
                            </div>

                            <div className="requisitosNaoFuncionais">
                                <div className="tituloRNF">
                                    <h2>Requisitos não Funcionais</h2>
                                </div>
                                <section>
                                    {reqNaoFuncionais.length > 0 ? (
                                        reqNaoFuncionais.map((rnf, index) => ( // Usando 'rnf' para clareza
                                            <div className="listaRNF" key={rnf.idReqDoc}>
                                                <p>
                                                    <span className="tagListaRnRnfRf">RNF{String(index + 1).padStart(2, "0")}:</span>{rnf.idRequisitoNavigation.textoReq}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="listaRNF">
                                            <p>Nenhum RNF cadastrado.</p>
                                        </div>
                                    )}
                                </section>
                            </div>
                        </div>

                        <div className="comentarioDisplay" >
                            <p>Confirmar</p>
                            <img src={Assinatura} alt="Botão de Comentário" />
                        </div>
                    </section>
                </section>
            </main>
        </div>
    )
}