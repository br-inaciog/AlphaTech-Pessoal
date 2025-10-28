import './Inicio.css';
import MenuLateral from '../../components/menuLateral/MenuLateral';
import Usuario from '../../assets/img/User.png';
import arquivo from '../../assets/img/Arquivo.png';
import Adicionar from '../../assets/img/Adicionar.png'
import Anexar from '../../assets/img/upload.svg'
import { Link } from 'react-router';
// import Escaner from '../../assets/img/Escaner.png'

export default function Inicio() {
    return (
        <div className="containerGeral">
            <MenuLateral />
            <main className="conteudoPrincipal">
                <section className="areaTrabalho">
                    <div className="cabecalhoArea">
                        <button className="btnArea">Área de Trabalho</button>
                        <div className="usuarioArea">
                            <img src={Usuario} alt="" />
                            Funcionário
                            <span className="iconMoon"></span>

                        </div>
                    </div>
                    <div className="statusDocumentos">
                        <div className="statusCard">
                            <span className="statusNum">6</span>
                            <span className="statusLabel">Pendentes</span>
                        </div>
                        <div className="statusCard">
                            <span className="statusNum">20</span>
                            <span className="statusLabel">Assinados</span>
                        </div>
                        <div className="statusCard">
                            <span className="statusNum">9</span>
                            <span className="statusLabel">Finalizados</span>
                        </div>
                    </div>
                    <div className="proximaEntregas">
                        <h3>PROXIMAS ENTREGAS</h3>
                        <div className="entregaCard entregaVermelho">
                            <span className="entregaNum">15</span>
                            <span className="entrega-label">Documentação Hershey's</span>
                        </div>
                        <div className="entregaCard entregaMarrom">
                            <span className="entregaNum">20</span>
                            <span className="entrega-label">Projeto Pfizer</span>
                        </div>
                        <div className="entregaCard entregaBege">
                            <span className="entregaNum">28</span>
                            <span className="entrega-label">Documentação Johnson&Johnsons</span>
                        </div>
                    </div>
                    <article className="documentosActions">
                        <form action="" className="docAction">
                            <img src={arquivo} alt="Imagem Arquivo" className='imgArquivo' />
                            <div className='divAnexar'>
                                <h4>Anexar Documentação</h4>
                                <label className='arquivoLabel'>
                                    <img src={Anexar} alt="Ícone de upload" />
                                    Anexar Documento
                                    <input
                                        type="file"
                                        className='arquivoInput'
                                    />
                                </label>
                                <input type="text" placeholder="Nome do Arquivo" className="inputArquivo" />
                                <button className='botaoEnviarDoc'>Enviar</button>
                            </div>
                        </form>

                        <form action="" className="docAction">
                            <img src={Adicionar} alt="" className='imgEscanear' />
                            <div className='docActionDisplay'>
                                <div className='divEscanear'>
                                    <h4>Criar Documento</h4>
                                    <input type="text" placeholder="Nome do Arquivo" className="inputArquivo" />
                                    <Link className='botaoEnviarDoc' to="/docAndamentoFunc">
                                        Enviar
                                    </Link>
                                </div>
                            </div>
                        </form>

                        {/* <form action="" className="docAction">
                            <img src={Escaner} alt="" className='imgEscanear' />
                            <div className='docActionDisplay'>
                                <div className='divEscanear'>
                                    <h4>Digitalizar Documento</h4>
                                    <label className='arquivoLabel'>
                                        <img src={Anexar} alt="Ícone de upload" />
                                        Escanear Documento
                                        <input
                                            type="file"
                                            className='arquivoInput'
                                        />
                                    </label>
                                    <input type="text" placeholder="Nome do Arquivo" className="inputArquivo" />
                                    <button className='botaoEnviarDoc'>Enviar</button>
                                </div>
                            </div>
                        </form> */}

                    </article>
                </section>
            </main>
        </div>
    )
}