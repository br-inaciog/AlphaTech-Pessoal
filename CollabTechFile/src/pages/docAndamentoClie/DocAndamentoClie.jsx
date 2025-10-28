import "./docAndamentoClie.css"

import MenuLateralCliente from "../../components/menuLateralCliente/MenuLateralCliente"
import CabecalhoCliente from "../../components/cabecalhoCliente/CabecalhoCliente"

import Comentario from "../../assets/img/Comentario.png"
import { Link } from "react-router-dom"

export default function DocAndamentoClie() {
    return (
        <div className="containerGeral'">
            <MenuLateralCliente />
            <main className="conteudoPrincipal">
                <section className="areaTrabalho">
                    <CabecalhoCliente />

                    <section className="docAndamento">
                        <div className="titulo">
                            <h1>Documento em Andamento</h1>
                        </div>

                        <div className="documento">
                            <p className="docNome">Nome Documento</p>

                            <div className="regrasDeNegocio">
                                <div className="tituloRN">
                                    <h2>Regras de Negócio</h2>
                                </div>

                                <section>
                                    <div className="listaRN">
                                        <p>RN01: <span>RN01 listadada</span></p>
                                    </div>
                                </section>
                            </div>


                            <div className="requisitosFuncionais">
                                <div className="tituloRF">
                                    <h2>Requisitos Funcionais</h2>
                                </div>

                                <section>
                                    <div className="listaRF">
                                        <p>RN01: <span>RN01 listadada</span></p>
                                    </div>
                                </section>
                            </div>


                            <div className="requisitosNaoFuncionais">
                                <div className="tituloRNF">
                                    <h2>Requisitos não Funcionais</h2>
                                </div>

                                <section>
                                    <div className="listaRNF">
                                        <p>RN01: <span>RN01 listadada</span></p>
                                    </div>
                                </section>
                            </div>

                            {/* <Link to="/ModalComentarioCliente" className="voltar">          */}
                            <Link to="/ModalComentarioCliente" className="voltar">
                            <div className="comentarioDisplay">
                                <p>Comentar</p>
                                <img src={Comentario} alt="Botão de Comentário" />
                            </div>
                            </Link>
                            {/* </Link> */}
                        </div>
                    </section>
                </section>
            </main>
        </div>
    )
}