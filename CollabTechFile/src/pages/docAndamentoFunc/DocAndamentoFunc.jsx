import "./docAndamentoFunc.css"
import MenuLateral from "../../components/menuLateral/MenuLateral";
import Cabecalho from "../../components/cabecalho/Cabecalho"

import Adicionar from "../../assets/img/Adicionar.svg"
import Deletar from "../../assets/img/Delete.svg";
import Editar from "../../assets/img/Editar.png"
import Swal from "sweetalert2";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../Services/Service";
import { useParams } from "react-router";


export default function DocAndamentoFunc() {
    const { idDocumento } = useParams();

    const [listaCliente, setListaCliente] = useState([]);
    const [clienteFiltrado, setClienteFiltrado] = useState([]);

    const [listaVersaoDoc, setListaVersaoDoc] = useState([]);
    const [versaoDoc, setVersaoDoc] = useState([]);

    const [listaRFeRNF, setlistaRFeRNF] = useState([]);

    const [requisitoFuncional, setRequisitoFuncional] = useState("");
    const [reqFuncional] = useState("RF")


    const [requisitoNaoFuncional, setRequisitoNaoFuncional] = useState("");
    const [reqNaoFuncional] = useState("RNF")


    const [listaRN, setListaRN] = useState([]);
    const [regraDeNegocio, setRegraDeNegocio] = useState("");
    const [regraNegocio] = useState("Edite sua Regra de Negócio.")

    function alertarSalvar() {
        Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Salvar",
            denyButtonText: `Não Salvar`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire("Saved!", "", "success");
            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
            }
        });
    }

    function alertar(icone, mensagem) {
        const Toast = Swal.mixin({
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

    async function cadDocumento() {
        try {
            alertarSalvar();
        } catch (error) {

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

    async function cadReqFuncional(e) {
        e.preventDefault()

        try {
            const novaRequisito = await api.post("Requisito", {
                tipo: reqFuncional
            });

            await api.post("ReqDoc", {
                idDocumento: idDocumento,
                idRequisito: novaRequisito.data.idRequisito
            });

            alertar("success", "Requisito cadastrado no documento!");
            setRequisitoFuncional("");
            // listaRFeRNF();
        } catch (error) {
            alertar("error", "Erro ao cadastrar!");
            console.log(error);
        }
    }

    async function cadReqNaoFuncional(e) {
        e.preventDefault()

        try {
            const novaRequisito = await api.post("Requisito", {
                tipo: reqNaoFuncional
            });

            await api.post("ReqDoc", {
                idDocumento: idDocumento,
                idRequisito: novaRequisito.data.idRequisito
            });

            alertar("success", "Requisito cadastrado no documento!");
            setRequisitoNaoFuncional("");
            // listaRFeRNF();
        } catch (error) {
            alertar("error", "Erro ao cadastrar!");
            console.log(error);
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
                idRegra: novaRegra.data.idRegra
            });

            alertar("success", "Regra cadastrada no documento!");
            setRegraDeNegocio("");
            listarRN();
        } catch (error) {
            alertar("error", "Erro ao cadastrar!");
            console.log(error);
        }
    }
    async function listarRN() {
        try {
            const resposta = await api.get("regraDoc");
            const regraNegocioDocAtual = resposta.data.filter(r => r.idDocumento == idDocumento);
            setListaRN(regraNegocioDocAtual);
        } catch (error) {

        }
    }

    async function listarVersoes() {
        try {
            const resposta = await api.get("documentoVersoes");
            const versoesDoDocumentoAtual = resposta.data.filter(v => v.idDocumento == idDocumento);
            setListaVersaoDoc(versoesDoDocumentoAtual);
        } catch (error) {
            console.log("Erro ao buscar versões:", error);
        }
    }

    useEffect(() => {
        listarCliente();
        listarVersoes();
        listarRN();
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

                        <form action="" className="documento">
                            <div className="inputNome">
                                <input type="text" placeholder="Nome Documento" />
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
                                        listaRN.map((regra) =>
                                            <div className="listaRN">
                                                <p>RN01: <span>RN01 listadada</span></p>
                                                <div className="iconeRequisitosERegra">
                                                    <img className="botaoExcluir" src={Deletar} alt="Lixeira" />
                                                    <img className="botaoEditar" src={Editar} alt="Caneta de Editar" />
                                                </div>
                                            </div>
                                        )
                                    ) : (
                                        <div className="listaRN">
                                            <p>Cadastrar Regras de Negócio.</p>
                                        </div>
                                    )
                                    }
                                </section>
                            </div>


                            <div className="requisitosFuncionais">
                                <div className="tituloRF">
                                    <h2>Requisitos Funcionais</h2>
                                    <button type="button" onClick={(e) => cadReqFuncional(e)}>
                                        <img className="botaoAdicionar" src={Adicionar} alt="Botao De Adicionar" />
                                    </button>
                                </div>

                                <section>
                                    <div className="listaRF">
                                        <p>RN01: <span>RN01 listadada</span></p>

                                        <div className="iconeRequisitosERegra">
                                            <img className="botaoExcluir" src={Deletar} alt="Lixeira" />
                                            <img className="botaoEditar" src={Editar} alt="Caneta de Editar" />
                                        </div>
                                    </div>
                                </section>
                            </div>


                            <div className="requisitosNaoFuncionais">
                                <div className="tituloRNF">
                                    <h2>Requisitos não Funcionais</h2>
                                    <button type="button" onClick={(e) => cadReqNaoFuncional(e)}>
                                        <img className="botaoAdicionar" src={Adicionar} alt="Botao De Adicionar" />
                                    </button>
                                </div>

                                <section>
                                    <div className="listaRNF">
                                        <p>RN01: <span>RN01 listadada</span></p>

                                        <div className="iconeRequisitosERegra">
                                            <img className="botaoExcluir" src={Deletar} alt="Lixeira" />
                                            <img className="botaoEditar" src={Editar} alt="Caneta de Editar" />
                                        </div>
                                    </div>
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
            </main>
        </div >
    )
}