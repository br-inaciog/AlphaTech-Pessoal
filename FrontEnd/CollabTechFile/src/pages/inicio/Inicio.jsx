import { useEffect, useState } from 'react';
import Swal from "sweetalert2";
import api from "../../Services/Service";
import './Inicio.css';
import MenuLateral from '../../components/menuLateral/MenuLateral';
import Usuario from '../../assets/img/User.png';
import Adicionar from '../../assets/img/Adicionar.png';
import { Link } from 'react-router';

export default function Inicio() {
    const [listaCliente, setListaCliente] = useState([]);
    const [clienteFiltrado, setClienteFiltrado] = useState([]);

    const [nomeArquivo, setNomeArquivo] = useState("");
    const [nomeDoc, setNomeDoc] = useState("")
    const [pdf, setPdf] = useState("")
    const [dataDoc, setDataDoc] = useState("")
    const [destinatarioDoc, setDestinatarioDoc] = useState("")

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
            }
        });
        Toast.fire({
            icon: icone,
            title: mensagem
        });
    }

    function mostrarNomeArquivo(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== "application/pdf") {
                alertar("error", "Apenas arquivos PDF são permitidos!");
                e.target.value = "";
                setPdf("");
                setNomeArquivo("");
                return;
            }

            setNomeArquivo(file.name);
            setPdf(file);
        } else {
            setNomeArquivo("");
        }
    }

    async function listarCliente() {
        try {
            const resposta = await api.get("usuario");
            setListaCliente(resposta.data);

            const apenasClientes = resposta.data.filter(u => u.idTipoUsuario === 3);
            setClienteFiltrado(apenasClientes);
        } catch (error) {
            console.log("Erro ao buscar clientes:", error);
        }
    }


    async function cadastrarDoc(e) {
        e.preventDefault();

        console.log(nomeDoc);
        console.log(pdf);
        console.log(nomeArquivo);
        console.log(destinatarioDoc);
        console.log(dataDoc);

        if (!nomeDoc.trim() || !pdf || !nomeArquivo.trim() || !destinatarioDoc || !dataDoc) {
            alertar("warning", "Preencha todos os campos antes de enviar!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("nomeDocumento", nomeDoc);
            formData.append("destinatario", destinatarioDoc);
            formData.append("prazo", dataDoc);
            formData.append("arquivo", pdf);

            await api.post("Documentos", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alertar("success", "Documento enviado com sucesso!");
            setNomeDoc("");
            setPdf("");
            setNomeArquivo("");
            setDestinatarioDoc("");
            setDataDoc("");
        } catch (error) {
            alertar("error", "Erro ao enviar documento!");
            console.error(error);
        }
    }



    useEffect(() => {
        listarCliente();
    }, []);

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
                        <h3>PRÓXIMAS ENTREGAS</h3>
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
                        <div className="docAction">
                            <h4>Anexar/Criar Documentação:</h4>
                            <form onSubmit={cadastrarDoc} className="docActionFlex">
                                <input
                                    type="text"
                                    placeholder="Nome do Arquivo"
                                    className="inputArquivo"
                                    value={nomeDoc}
                                    onChange={(e) => setNomeDoc(e.target.value)}
                                />

                                <div className="anexoContainer">
                                    <input
                                        type="file"
                                        id="arquivoInput"
                                        className="arquivoInput"
                                        style={{ display: "none" }}
                                        accept="application/pdf"
                                        onChange={mostrarNomeArquivo}
                                    />

                                    <label htmlFor="arquivoInput" className="labelArquivo">
                                        <img
                                            src={Adicionar}
                                            alt="Adicionar documento"
                                            className="imgEscanear"
                                        />
                                    </label>

                                    <input
                                        type="text"
                                        className="inputNomeArquivo"
                                        placeholder="Nenhum arquivo selecionado"
                                        value={nomeArquivo}
                                        disabled
                                    />
                                </div>

                                <div className="botaoSelectRemententeInicio">
                                    <p>Remetente:</p>
                                    <select
                                        value={destinatarioDoc}
                                        onChange={(e) => setDestinatarioDoc(e.target.value)}
                                    >
                                        <option value="" disabled>Destinatário</option>
                                        {clienteFiltrado.length > 0 ? (
                                            clienteFiltrado.map((usuario) => (
                                                <option key={usuario.idUsuario} value={usuario.idUsuario}>
                                                    {usuario.nome}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>Nenhum cliente encontrado</option>
                                        )}
                                    </select>
                                </div>

                                <div className="prazoEntregaInicio">
                                    <label>Prazo de Entrega:</label>
                                    <input
                                        type="date"
                                        value={dataDoc}
                                        onChange={(e) => setDataDoc(e.target.value)}
                                    />
                                </div>

                                <button type="submit" className="botaoEnviarDoc">
                                    Enviar
                                </button>
                            </form>
                        </div>
                    </article>
                </section>
            </main>
        </div>
    );
}
