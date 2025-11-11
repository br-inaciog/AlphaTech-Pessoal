import "./docFinalizadoClie.css"

import MenuLateral from "../../components/menuLateral/MenuLateral"
import CabecalhoCliente from "../../components/cabecalhoCliente/CabecalhoCliente"

import Assinatura from "../../assets/img/Assinatura.png"

export default function DocFinalizadoClie() {
    return (
        <div className="containerGeral'">
            <MenuLateral />
            <main className="conteudoPrincipal">
                <section className="areaTrabalho">
                    <CabecalhoCliente />

                    <section className="docAndamento">
                        <div className="titulo">
                            <h1>Documento Finalizado</h1>
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

                            <div className="comentarioDisplay">
                                <p>Assinar</p>
                                <img src={Assinatura} alt="Botão de Comentário" />
                            </div>
                        </div>
                    </section>
                </section>
            </main>
        </div>
    )
}