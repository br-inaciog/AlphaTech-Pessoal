import "./docAndamentoClie.css"

import ModalPDF from "../../components/documento/Documento";


import MenuLateral from "../../components/menuLateral/MenuLateral"

import Comentar from "../../assets/img/Comentario.png"
import Cabecalho from "../../components/cabecalho/Cabecalho"
import Abrir from "../../assets/img/Abrir.png"
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import api from "../../services/Service";

export default function DocFinalizadoClie() {
    const { nomeDocumento, idDocumento } = useParams();
    const nomeCorrigido = nomeDocumento.replaceAll("-", " ");

    const [listaRN, setListaRN] = useState([]);
    const [listaReqFunc, setListaReqFunc] = useState([])
    const [listaReqNaoFunc, setListaReqNaoFunc] = useState([])

    const [showModal, setShowModal] = useState(false);

    const [documentoInfo, setDocumentoInfo] = useState(null);
    async function buscarDocumento() {
        try {
            const resposta = await api.get(`Documentos/${idDocumento}`);
            const doc = resposta.data;

            setDocumentoInfo({
                versaoAtual: doc.versaoAtual,
                prazo: doc.prazo,
                remetente: doc.cliente?.nome || "Sem destinatário"
            });
        } catch (error) {
            console.error("Erro ao buscar informações do documento:", error);
        }
    }

    const [pdfUrl, setPdfUrl] = useState(null);

    async function abrirPDF() {
        try {
            const resposta = await api.get(`documentos/${idDocumento}/pdf`, {
                responseType: "blob"
            });

            const url = URL.createObjectURL(resposta.data);
            setPdfUrl(url);
        } catch (err) {
            console.error("Erro ao abrir PDF", err);
        }
    }
    function fecharPDF() {
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
    };


    //Regras de Negócio
    async function listarRN() {
        try {
            const [regraDocs, regras] = await Promise.all([
                api.get("regraDoc"),
                api.get("Regra")
            ]);

            const regraNegocioDocAtual = regraDocs.data
                .filter(r => r.idDocumento == idDocumento)
                .map(r => {
                    const regra = regras.data.find(x => x.idRegra === r.idRegra);
                    return {
                        ...r,
                        nome: regra ? regra.nome : "Sem nome"
                    };
                });
            console.log(regraNegocioDocAtual);

            setListaRN(regraNegocioDocAtual.sort((a, b) => a.idRegrasDoc - b.idRegrasDoc))
        } catch (error) {
            console.log("Erro ao listar RN:", error);
        }
    }

    //Requisito Funcional
    async function listarReqFunc() {
        try {
            const [reqFuncDocs, requisitos] = await Promise.all([
                api.get("ReqDoc"),
                api.get("Requisito")
            ]);

            const rnfDoDocumentoAtual = reqFuncDocs.data
                .filter(r => r.idDocumento == idDocumento)
                .map(r => {
                    const requisito = requisitos.data.find(x => x.idRequisito === r.idRequisito);
                    return {
                        ...r,
                        textoReq: requisito ? requisito.textoReq : "Sem texto",
                        tipo: requisito ? requisito.tipo : ""
                    };
                })
                .filter(r => r.tipo === "RF");

            setListaReqFunc(rnfDoDocumentoAtual.sort((a, b) => a.idRequisito - b.idRequisito));
            console.log(rnfDoDocumentoAtual);
        } catch (error) {
            console.log("Erro ao listar RNF:", error);
        }
    }

    //Requisito Não Funcional
    async function listarReqNaoFunc() {
        try {
            const [reqNaoFuncDocs, requisitos] = await Promise.all([
                api.get("ReqDoc"),
                api.get("Requisito")
            ]);

            const rnfDoDocumentoAtual = reqNaoFuncDocs.data
                .filter(r => r.idDocumento == idDocumento)
                .map(r => {
                    const requisito = requisitos.data.find(x => x.idRequisito === r.idRequisito);
                    return {
                        ...r,
                        textoReq: requisito ? requisito.textoReq : "Sem texto",
                        tipo: requisito ? requisito.tipo : ""
                    };
                })
                .filter(r => r.tipo === "RNF");

            setListaReqNaoFunc(rnfDoDocumentoAtual.sort((a, b) => a.idRequisito - b.idRequisito));
            console.log(rnfDoDocumentoAtual);
        } catch (error) {
            console.log("Erro ao listar RNF:", error);
        }
    }

    useEffect(() => {
        listarRN();
        listarReqFunc();
        listarReqNaoFunc();
        buscarDocumento();
    }, [])

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

                        <button className="abrirDoc" onClick={abrirPDF}>
                            <img src={Abrir} alt="" />
                            <p>Abrir PDF</p>
                        </button>

                        <div className="documento">
                            <div className="nomeDoc">
                                <p>Nome: <span>{nomeCorrigido || "Carregando..."}</span></p>
                            </div>

                            <div className="regrasDeNegocio">
                                <div className="tituloRN">
                                    <h2>Regras de Negócio</h2>
                                </div>

                                <section>
                                    {listaRN.length > 0 ? (
                                        listaRN.map((regra, index) => (
                                            <div className="listaRN" key={regra.idRegrasDoc}>
                                                <p>RN{String(index + 1).padStart(2, "0")}: <span>{regra.nome}</span></p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="listaRN">
                                            <p>Nenhuma RN Cadastrada.</p>
                                        </div>
                                    )}
                                </section>
                            </div>


                            <div className="requisitosFuncionais">
                                <div className="tituloRF">
                                    <h2>Requisitos Funcionais</h2>
                                </div>

                                <section>
                                    {listaReqFunc.length > 0 ? (
                                        listaReqFunc.map((rnf, index) => (
                                            <div className="listaRF" key={rnf.idRequisito}>
                                                <p>RNF{String(index + 1).padStart(2, "0")}: <span>{rnf.textoReq}</span></p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="listaRNF">
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
                                    {listaReqNaoFunc.length > 0 ? (
                                        listaReqNaoFunc.map((rnf, index) => (
                                            <div className="listaRNF" key={rnf.idRequisito}>
                                                <p>RNF{String(index + 1).padStart(2, "0")}: <span>{rnf.textoReq}</span></p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="listaRNF">
                                            <p>Nenhum RNF cadastrado.</p>
                                        </div>
                                    )}
                                </section>
                            </div>

                            <div className="comentarioDisplay">
                                <p>Comentar</p>
                                <img src={Comentar} alt="Botão de Comentário" />
                            </div>
                        </div>
                    </section>
                </section>
                {showModal && (
                    <ModalSalvarDocumento
                        nomeDocumento={nomeCorrigido}
                        prazoEntrega={prazo}
                        onCancel={() => setShowModal(false)}
                        onPublish={modalSalvarDoc}
                    />
                )}
                {pdfUrl && (
                    <ModalPDF pdfUrl={pdfUrl} onClose={fecharPDF} />
                )}
            </main>
        </div>
    )
}