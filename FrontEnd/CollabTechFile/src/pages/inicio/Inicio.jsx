import { useEffect, useState } from 'react';
import Swal from "sweetalert2";
import api from "../../Services/Service";
import './Inicio.css';
import MenuLateral from '../../components/menuLateral/MenuLateral';
import Usuario from '../../assets/img/User.png';
import Adicionar from '../../assets/img/Adicionar.png';
import secureLocalStorage from 'react-secure-storage';
import { Link } from 'react-router';
import { useNavigate } from "react-router-dom";
import { userDecodeToken } from '../../auth/Auth';

export default function Inicio() {
    const [listaEmpresa, setListaEmpresa] = useState([]);
    const [empresaRemetente, setEmpresaRemetente] = useState([]);

    const [nomeArquivo, setNomeArquivo] = useState("");
    const [nomeDoc, setNomeDoc] = useState("")
    const [pdf, setPdf] = useState("")
    const [prazoDoc, setprazoDoc] = useState("")
    const [empresaDoc, setempresaDoc] = useState("")
    const [novoStatus, setNovoStatus] = useState("Pendente")
    const [criadoEm, setCriadoEm] = useState(() => {
        const agora = new Date();
        const data = agora.toISOString().slice(0, 19).replace("T", " ");
        return data;
    });
    const [versaoInicial, setVersaoInicial] = useState(1);
    const [statusDoc, setStatusDoc] = useState(1)

    const [pendentes, setPendentes] = useState([]);
    const [assinados, setAssinados] = useState([]);
    const [finalizados, setFinalizados] = useState([]);
    const navigate = useNavigate();


    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const token = secureLocalStorage.getItem("token");

        const dadosUsuario = userDecodeToken(token);

        setUsuario(dadosUsuario);
    }, []);


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

    async function listarDocumentosPorStatus() {
        try {
            const resposta = await api.get("Documentos");
            const docs = resposta.data;

            setPendentes(docs.filter(d => d.status === false));
            setAssinados(docs.filter(d => d.assinadoEm !== null));
            setFinalizados(docs.filter(d => d.status === true));
        } catch (error) {
            console.log("Erro ao buscar documentos:", error);
        }
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

    async function listarEmpresa() {
        try {
            const resposta = await api.get("empresa");
            setListaEmpresa(resposta.data);
            console.log(resposta.data);

        } catch (error) {
            console.log("Erro ao buscar clientes:", error);
        }
    }


    async function cadastrarDoc(e) {
        e.preventDefault();

        const prazo = new Date(prazoDoc);
        const agora = new Date();

        if (prazo <= agora) {
            alertar("warning", "A data de entrega deve ser no Futuro!");
            return;
        }

        // valida campos
        if (!nomeDoc.trim() || !nomeArquivo.trim() || !empresaDoc || !prazoDoc) {
            alertar("warning", "Preencha todos os campos antes de enviar!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("nomeDocumento", nomeDoc);
            formData.append("empresa", empresaDoc);
            formData.append("prazo", prazoDoc);
            formData.append("status", novoStatus);
            formData.append("criadoEm", criadoEm);
            formData.append("versaoInicial", versaoInicial);
            formData.append("statusDoc", statusDoc);

            await api.post("Documentos/upload-ocr", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alertar("success", "Documento enviado com sucesso!");
            setNomeDoc("");
            setempresaDoc("");
            setprazoDoc("");

        } catch (error) {
            alertar("error", "Erro ao enviar documento!");
            console.error(error);
        }
    }


    useEffect(() => {
        listarEmpresa();
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
                            {usuario ? (
                                <div className="infos-usuario">
                                    <p className="usuario-nome">{usuario.nome} - {usuario.tipoUsuario}</p>
                                    <p className="usuario-tipo"></p>
                                </div>
                            ) : (
                                <p>Usuário não encontrado.</p>
                            )}
                            <span className="iconMoon"></span>
                        </div>
                    </div>

                    <div className="statusDocumentos">
                        <div
                            className="statusCard"
                            onClick={() => navigate("/Listagem?status=pendente")}
                            style={{ cursor: "pointer" }}
                        >
                            <span className="statusNum">{pendentes.length}</span>
                            <span className="statusLabel">Pendentes</span>
                        </div>

                        <div
                            className="statusCard"
                            onClick={() => navigate("/Listagem?status=assinado")}
                            style={{ cursor: "pointer" }}
                        >
                            <span className="statusNum">{assinados.length}</span>
                            <span className="statusLabel">Assinados</span>
                        </div>

                        <div
                            className="statusCard"
                            onClick={() => navigate("/Listagem?status=finalizado")}
                            style={{ cursor: "pointer" }}
                        >
                            <span className="statusNum">{finalizados.length}</span>
                            <span className="statusLabel">Finalizados</span>
                        </div>
                    </div>

                    <div className="proximaEntregas">
                        <h3>Próximas Entregas</h3>
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
                                    <p>Empresa:</p>
                                    <select
                                        value={empresaDoc}
                                        onChange={(e) => setempresaDoc(e.target.value)}
                                    >
                                        <option value="" disabled>Empresa</option>
                                        {listaEmpresa.length > 0 ? (
                                            listaEmpresa.map(empresa => (
                                                <option key={empresa.idEmpresa} value={empresa.idEmpresa}>
                                                    {empresa.nome}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>Versões</option>
                                        )}
                                    </select>
                                </div>

                                <div className="prazoEntregaInicio">
                                    <label>Prazo de Entrega:</label>
                                    <input
                                        type="date"
                                        value={prazoDoc}
                                        onChange={(e) => setprazoDoc(e.target.value)}
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
