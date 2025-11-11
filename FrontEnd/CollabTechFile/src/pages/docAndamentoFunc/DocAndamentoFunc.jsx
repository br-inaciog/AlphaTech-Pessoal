import "./docAndamentoFunc.css"
import MenuLateral from "../../components/menuLateral/MenuLateral";
import Cabecalho from "../../components/cabecalho/Cabecalho"
import ModalSalvarDocumento from "../../components/salvarDocumento/ModalSalvarDocumento";
import ModalPDF from "../../components/documento/Documento";



import Adicionar from "../../assets/img/Adicionar.svg"
import Deletar from "../../assets/img/Delete.svg";
import Editar from "../../assets/img/Editar.png"
import Abrir from "../../assets/img/Abrir.png"
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import api from "../../services/Service";
import { useParams } from "react-router";


export default function DocAndamentoFunc() {
    const { nomeDocumento, idDocumento } = useParams();
    const nomeCorrigido = nomeDocumento.replaceAll("-", " ");

    const [showModal, setShowModal] = useState(false);

    async function modalSalvarDoc(mensagem) {
        try {
            // Aqui tu pode colocar a lógica real de salvar o documento no backend
            console.log("Mensagem salva:", mensagem);

            alertar("success", "Documento salvo com sucesso!");
            setShowModal(false);
        } catch (error) {
            alertar("error", "Erro ao salvar o documento!");
            console.error(error);
        }
    }
    async function cadDocumento(e) {
        e.preventDefault();
        setShowModal(true);
    }

    const [prazo, setPrazo] = useState("");

    const [listaCliente, setListaCliente] = useState([]);
    const [clienteFiltrado, setClienteFiltrado] = useState([]);

    const [listaVersaoDoc, setListaVersaoDoc] = useState([]);
    const [versaoDoc, setVersaoDoc] = useState([]);

    const [listaRN, setListaRN] = useState([]);
    const [regraDeNegocio, setRegraDeNegocio] = useState("");
    const [regraNegocio] = useState("Edite sua Regra de Negócio.")

    const [listaReqFunc, setListaReqFunc] = useState([])
    const [requisitoFuncional, setRequisitoFuncional] = useState("");
    const [reqFuncional] = useState("RF")
    const [reqFuncionalText] = useState("Edite seu Requisito Funcional.")

    const [listaReqNaoFunc, setListaReqNaoFunc] = useState([])
    const [requisitoNaoFuncional, setRequisitoNaoFuncional] = useState("");
    const [reqNaoFuncional] = useState("RNF")
    const [reqNaoFuncionalText] = useState("Edite seu Requisito não Funcional.")

    function alertar(icone, mensagem) {
        const Toast = Swal.mixin({
            theme: 'dark',
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            },
        });
        Toast.fire({
            icon: icone,
            title: mensagem,
        });
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

    async function listarVersoes() {
        try {
            const resposta = await api.get("documentoVersoes");
            const versoesDoDocumentoAtual = resposta.data.filter(v => v.idDocumento == idDocumento);
            setListaVersaoDoc(versoesDoDocumentoAtual);
        } catch (error) {
            console.log("Erro ao buscar versões:", error);
        }
    }
    async function listarCliente() {
        try {
            const resposta = await api.get("usuario")
            setListaCliente(resposta.data);

            const apenasClientes = resposta.data.filter(u => u.idTipoUsuario === 3);
            setClienteFiltrado(apenasClientes);
        } catch (error) {
            console.log("Erro ao buscar clientes:", error);
        }
    }

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
    async function cadastrarRN(e) {
        e.preventDefault();

        try {
            const novaRegra = await api.post("Regra", {
                nome: regraNegocio
            });

            await api.post("regraDoc", {
                idDocumento: idDocumento,
                idRegras: novaRegra.data.idRegras
            });

            alertar("success", "Regra cadastrada no documento!");
            setRegraDeNegocio("");
            listarRN();
        } catch (error) {
            alertar("error", "Erro ao cadastrar!");
            console.log(error);
        }
    }
    async function deletarRN(regra) {
        Swal.fire({
            theme: 'dark',
            title: 'Tem Certeza?',
            text: "Essa ação não poderá ser desfeita!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#B51D44',
            cancelButtonColor: '#000000',
            confirmButtonText: 'Sim, apagar!',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`regraDoc/${regra.idRegrasDoc}`);
                    alertar("success", "Regra Excluída!");
                    listarRN();
                } catch (error) {
                    console.log(error);
                    alertar("error", "Erro ao Excluir!");
                }
            }
        });
    }
    async function editarRN(RN) {
        try {
            const result = await Swal.fire({
                title: "Editar Regra De Negócio!",
                html: `
                <input id="campo1" class="swal2-input" placeholder="Título" value="${RN.nome || ''}">
            `,
                theme: 'dark',
                showCancelButton: true,
                confirmButtonText: "Salvar",
                cancelButtonText: "Cancelar",
                focusConfirm: false,
                preConfirm: () => {
                    const campo1 = document.getElementById("campo1").value;
                    if (!campo1) {
                        Swal.showValidationMessage("Preencha o Campo");
                        return false;
                    }
                    return campo1;
                }
            });

            if (result.isConfirmed) {
                const novoNome = result.value;

                await api.put(`Regra/${RN.idRegras}`, {
                    nome: novoNome
                });

                alertar("success", "Regra atualizada com sucesso!");
                listarRN();
            }
        } catch (error) {
            console.log(error);
            alertar("error", "Erro ao atualizar a regra!");
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
    async function cadastrarReqFuncional(e) {
        e.preventDefault()

        try {
            const novaRequisito = await api.post("Requisito", {
                tipo: reqFuncional,
                textoReq: reqFuncionalText
            });

            await api.post("ReqDoc", {
                idDocumento: idDocumento,
                idRequisito: novaRequisito.data.idRequisito
            });

            alertar("success", "Requisito cadastrado no documento!");
            setRequisitoFuncional("");
            listarReqFunc();
        } catch (error) {
            alertar("error", "Erro ao cadastrar!");
            console.log(error);
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
    async function cadastrardReqNaoFuncional(e) {
        e.preventDefault()

        try {
            const novaRequisito = await api.post("Requisito", {
                tipo: reqNaoFuncional,
                textoReq: reqNaoFuncionalText
            });

            await api.post("ReqDoc", {
                idDocumento: idDocumento,
                idRequisito: novaRequisito.data.idRequisito
            });

            alertar("success", "Requisito cadastrado no documento!");
            setRequisitoNaoFuncional("");
            listarReqNaoFunc();
        } catch (error) {
            alertar("error", "Erro ao cadastrar!");
            console.log(error);
        }
    }
    async function deletarReqNaoFunc(regra) {
        Swal.fire({
            theme: 'dark',
            title: 'Tem Certeza?',
            text: "Essa ação não poderá ser desfeita!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#B51D44',
            cancelButtonColor: '#000000',
            confirmButtonText: 'Sim, apagar!',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`ReqDoc/${regra.idReqDoc}`);
                    alertar("success", "Requisito Excluído!");
                    listarReqNaoFunc();
                } catch (error) {
                    console.log(error);
                    alertar("error", "Erro ao Excluir!");
                }
            }
        });
    }

    useEffect(() => {
        listarCliente();
        listarVersoes();
        listarRN();
        listarReqFunc();
        listarReqNaoFunc();
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

                        <form action="" className="documento">
                            <div className="nomeDoc">
                                <p>Nome: <span>{nomeCorrigido || "Carregando..."}</span></p>
                            </div>

                            <div className="infDocumento">
                                <div className="botaoFiltrarVersoesDoc">
                                    <p>Versão Documento</p>
                                    <select>
                                        <option disabled selected>Versões</option>
                                        {listaVersaoDoc.length > 0 ? (
                                            listaVersaoDoc.map(versao => (
                                                <option key={versao.idVersaoDocumento} value={versao.idVersaoDocumento}>
                                                    {versao.numeroVersao}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>S/Versões</option>
                                        )}
                                    </select>
                                </div>

                                <div className="botaoSelectRementente">
                                    <p>Rementente</p>
                                    <select>
                                        <option disabled selected>Destinatário</option>
                                        {clienteFiltrado.length > 0 ? (
                                            clienteFiltrado.map((usuario) =>
                                                <option key={usuario.idUsuario} value={usuario.idUsuario}>
                                                    {usuario.nome}
                                                </option>
                                            )
                                        ) : (
                                            <option disabled>Nenhum cliente encontrado</option>
                                        )}
                                    </select>
                                </div>


                                <div className="prazoEntrega">
                                    <label>Prazo de Entrega:</label>
                                    <input type="date" />
                                </div>
                            </div>

                            <div className="regrasDeNegocio">
                                <div className="tituloRN">
                                    <h2>Regras de Negócio</h2>
                                    <button type="button" onClick={(e) => cadastrarRN(e)}>
                                        <img className="botaoAdicionar" src={Adicionar} alt="Botao De Adicionar" />
                                    </button>
                                </div>

                                <section>
                                    {listaRN.length > 0 ? (
                                        listaRN.map((regra, index) => (
                                            <div className="listaRN" key={regra.idRegrasDoc}>
                                                <p>RN{String(index + 1).padStart(2, "0")}: <span>{regra.nome}</span></p>
                                                <div className="iconeRequisitosERegra">
                                                    <img
                                                        onClick={() => deletarRN(regra)}
                                                        className="botaoExcluir"
                                                        src={Deletar}
                                                        alt="Lixeira"
                                                    />
                                                    <img
                                                        onClick={() => editarRN(regra)}
                                                        className="botaoEditar"
                                                        src={Editar}
                                                        alt="Caneta de Editar"
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="listaRN">
                                            <p>Cadastrar Regras de Negócio.</p>
                                        </div>
                                    )}
                                </section>
                            </div>


                            <div className="requisitosFuncionais">
                                <div className="tituloRNF">
                                    <h2>Requisitos Funcionais</h2>
                                    <button type="button" onClick={(e) => cadastrarReqFuncional(e)}>
                                        <img className="botaoAdicionar" src={Adicionar} alt="Botao De Adicionar" />
                                    </button>
                                </div>

                                <section>
                                    {listaReqFunc.length > 0 ? (
                                        listaReqFunc.map((rnf, index) => (
                                            <div className="listaRF" key={rnf.idRequisito}>
                                                <p>RNF{String(index + 1).padStart(2, "0")}: <span>{rnf.textoReq}</span></p>

                                                <div className="iconeRequisitosERegra">
                                                    <img onClick={() => deletarReqNaoFunc(rnf)} className="botaoExcluir" src={Deletar} alt="Lixeira" />
                                                    <img className="botaoEditar" src={Editar} alt="Caneta de Editar" />
                                                </div>
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
                                <div className="tituloRF">
                                    <h2>Requisitos não Funcionais</h2>
                                    <button type="button" onClick={(e) => cadastrardReqNaoFuncional(e)}>
                                        <img className="botaoAdicionar" src={Adicionar} alt="Botao De Adicionar" />
                                    </button>
                                </div>

                                <section>
                                    {listaReqNaoFunc.length > 0 ? (
                                        listaReqNaoFunc.map((rnf, index) => (
                                            <div className="listaRNF" key={rnf.idRequisito}>
                                                <p>RNF{String(index + 1).padStart(2, "0")}: <span>{rnf.textoReq}</span></p>

                                                <div className="iconeRequisitosERegra">
                                                    <img onClick={() => deletarReqNaoFunc(rnf)} className="botaoExcluir" src={Deletar} alt="Lixeira" />
                                                    <img className="botaoEditar" src={Editar} alt="Caneta de Editar" />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="listaRNF">
                                            <p>Nenhum RNF cadastrado.</p>
                                        </div>
                                    )}
                                </section>
                            </div>

                            <div className="buttonFinalizar">
                                <button onClick={cadDocumento} className="finalizarDoc">
                                    Finalizar
                                </button>
                            </div>

                        </form>
                    </section>

                    <section className="areaComentarioDoc">
                        <div className="comentariosDocDisplay">
                            <div className="titulo">
                                <h1>Comentários</h1>
                            </div>
                        </div>

                        <div className="cardFeedbackDoc">
                            <div className="cabecalhoFeedbackDoc">
                                <span className="nomeFeedbackDoc">Tirulipa</span>

                                <div className="horarioDataComentario">
                                    <span className="dataFeedbackDoc">11/09/2001</span>
                                    <span className="horarioFeedbackDoc">12:03PM</span>
                                </div>
                            </div>
                            <p className="mensagemFeedbackDoc">Poderia Alterar a Terceira Linha da Regra de Negócios fgdhsjhgfvdsbjucdgbvdnjviudhebdnvjiudhwgbdvnjduwshgbdvnjugrfehj9dfivbedjbfhj.</p>
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
        </div >
    )
}