import "./docAndamentoClie.css"
import ModalComentarioCliente from "../../components/cometarioCliente/ModalComentarioCliente";
import ModalPDF from "../../components/documento/Documento";

import MenuLateral from "../../components/menuLateral/MenuLateral"
import Comentar from "../../assets/img/Comentario.png"
import Cabecalho from "../../components/cabecalho/Cabecalho"
import Abrir from "../../assets/img/Abrir.png"

import { data, useParams } from "react-router";
import { useEffect, useState } from "react";
import api from "../../services/Service";
import Swal from "sweetalert2";
import secureLocalStorage from "react-secure-storage";
import { userDecodeToken } from "../../auth/auth";

export default function DocAndamentoClie() {
    const { nomeDocumento, idDocumento } = useParams();
    const nomeCorrigido = nomeDocumento.replaceAll("-", " ");

    const [documentoAtual, setDocumentoAtual] = useState(null);
    const [reqFuncionais, setReqFuncionais] = useState([]);
    const [reqNaoFuncionais, setReqNaoFuncionais] = useState([]);
    const [comentarios, setComentarios] = useState([]);


    const [showComentarioModal, setShowComentarioModal] = useState(false);

    const [documentoInfo, setDocumentoInfo] = useState(null);

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

    const abrirComentarioModal = () => setShowComentarioModal(true);
    const fecharComentarioModal = () => setShowComentarioModal(false);

    const publicarComentario = async (comentario) => {
        const token = secureLocalStorage.getItem("token");
        const user = userDecodeToken(token);

        const dataCriacao = new Date();

        const dadosComentario = {
            idUsuario: parseInt(user.idUsuario),
            idDocumento: parseInt(idDocumento),
            texto: comentario,
            dataCriacao: dataCriacao.toISOString()
        };

        try {
            await api.post("Comentario", dadosComentario);

            console.log(`Comentário publicado com sucesso!`, dadosComentario);
            alertar("success", "Comentário cadastrado!")
            fecharComentarioModal();
            setComentarios();
        } catch (error) {
            console.error("Erro ao publicar comentário:", error);
            alertar("error", "Erro ao enviar o comentário. Tente novamente.");
        }
    };

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

    const fecharPDF = () => {
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
    };

    async function carregarComentarios() {
        try {
            const resposta = await api.get(`/Comentario/documento/${idDocumento}`);
            setComentarios(resposta.data);
        } catch (error) {
            console.error("Erro ao carregar comentários:", error);
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
        carregarComentarios();
        buscarDadosDocumento();
        buscarDocumento();
    }, []);

    return (
        <div className="containerGeral">
            <MenuLateral />
            <main className="conteudoPrincipal">
                <section className="areaTrabalho">
                    <Cabecalho />

                    <section className="docAndamento">
                        <div className="titulo">
                            <h1>Documento em Andamento</h1>
                        </div>

                        <button className="abrirDoc" onClick={abrirPDF}>
                            <img src={Abrir} alt="Abrir Documento PDF" />
                            <p>Abrir PDF</p>
                        </button>

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

                            <div className="comentarioDisplay" onClick={abrirComentarioModal}>
                                <p>Comentar</p>
                                <img src={Comentar} alt="Botão de Comentário" />
                            </div>
                        </div>
                    </section>

                    <section className="areaComentarioDoc">
                        <div className="comentariosDocDisplay">
                            <div className="titulo">
                                <h1>Comentários</h1>
                            </div>
                        </div>
                        {comentarios && comentarios.length > 0 ? (
                            comentarios.map((item) => {
                                const data = new Date(item.dataCriacao); 
                                const dataLocal = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                const horaLocal = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                                return (
                                    <div key={item.idComentario} className="cardFeedbackDoc">
                                        <div className="cabecalhoFeedbackDoc">
                                            <span className="nomeFeedbackDoc">{item.idUsuarioNavigation?.nome || "Usuário"}</span>
                                            <div className="horarioDataComentario">
                                                <span className="dataFeedbackDoc">{dataLocal}</span>
                                                <span className="horarioFeedbackDoc">{horaLocal}</span>
                                            </div>
                                        </div>
                                        <p className="mensagemFeedbackDoc">{item.texto}</p>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="comentarioVazio">
                                <p>Não há comentários ainda.</p>
                            </div>
                        )}

                    </section>
                </section>

                {pdfUrl && <ModalPDF pdfUrl={pdfUrl} onClose={fecharPDF} />}

                <ModalComentarioCliente
                    nomeDocumento={nomeCorrigido}
                    aberto={showComentarioModal}
                    aoCancelar={fecharComentarioModal}
                    aoPublicar={publicarComentario}
                />
            </main>
        </div>
    )
}