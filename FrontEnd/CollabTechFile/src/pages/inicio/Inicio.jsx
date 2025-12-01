import { useEffect, useState } from 'react';
import Swal from "sweetalert2";
import api from "../../services/Service";
import './Inicio.css';
import MenuLateral from '../../components/menuLateral/MenuLateral';
import Usuario from '../../assets/img/User.png';
import Adicionar from '../../assets/img/Adicionar.png';
import secureLocalStorage from 'react-secure-storage';
import { useNavigate } from "react-router-dom";
import { userDecodeToken } from '../../auth/Auth';

export default function Inicio() {
    const [listaEmpresa, setListaEmpresa] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    const [nomeDoc, setNomeDoc] = useState("");
    const [prazoDoc, setprazoDoc] = useState("");
    const [empresaDoc, setempresaDoc] = useState("");
    const [anexarPdf, setAnexarPdf] = useState(false);
    const [nomeArquivo, setNomeArquivo] = useState("");
    const [pdf, setPdf] = useState(null);

    const [novoStatus, setNovoStatus] = useState("Em Andamento");
    const [versaoInicial, setVersaoInicial] = useState(1.0);
    const [statusAtivo, setStatusAtivo] = useState(true);

    const [docsPorStatus, setDocsPorStatus] = useState({
        andamento: [],
        assinados: [],
        finalizados: []
    });

    const [proximasEntregas, setProximasEntregas] = useState([]);

    useEffect(() => {
        const token = secureLocalStorage.getItem("token");

        if (token) {
            try {
                const dadosUsuario = userDecodeToken(token);
                setUsuario(dadosUsuario);
            } catch {
                setUsuario(null);
            }
        }

        listarEmpresa();
        listarDocumentosPorStatus();
    }, []);

    function alertar(icone, mensagem) {
        const Toast = Swal.mixin({
            theme: 'dark',
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
        Toast.fire({ icon: icone, title: mensagem });
    }

    async function listarDocumentosPorStatus() {
        try {
            const resposta = await api.get("Documentos");
            const docs = resposta.data;

            const andamento = docs.filter(d => d.status && d.novoStatus === "Em Andamento");
            const assinados = docs.filter(d => d.status && d.novoStatus === "Assinado");
            const finalizados = docs.filter(d => d.status && d.novoStatus === "Finalizado");

            setDocsPorStatus({ andamento, assinados, finalizados });

            const proximos = [...andamento]
                .sort((a, b) => new Date(a.prazo) - new Date(b.prazo))
                .slice(0, 3);

            setProximasEntregas(proximos);
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
                setPdf(null);
                setNomeArquivo("");
                return;
            }

            setNomeArquivo(file.name);
            setPdf(file);
        } else {
            setNomeArquivo("");
            setPdf(null);
        }
    }

    async function listarEmpresa() {
        try {
            const resposta = await api.get("empresa");
            setListaEmpresa(resposta.data);
        } catch (error) {
            console.log("Erro ao buscar clientes:", error);
        }
    }

    function validarCamposComuns() {
        const prazo = new Date(prazoDoc);
        const agora = new Date();

        if (prazo <= agora) {
            alertar("warning", "A data de entrega deve ser no Futuro!");
            return false;
        }

        if (!nomeDoc.trim() || !empresaDoc || !prazoDoc) {
            alertar("warning", "Preencha o Nome, Empresa e Prazo antes de enviar!");
            return false;
        }

        if (!usuario || !usuario.idUsuario) {
            alertar("error", "Dados do usuário criador ausentes. Tente logar novamente.");
            return false;
        }

        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!validarCamposComuns()) return;

        if (anexarPdf) {
            if (!pdf) {
                alertar("warning", "Anexe o arquivo PDF para continuar.");
                return;
            }
            anexarDoc();
        } else {
            cadastrarDoc();
        }
    }

    async function cadastrarDoc() {
        try {
            const dadosDocumento = {
                idUsuario: usuario.idUsuario,
                idEmpresa: empresaDoc,
                nome: nomeDoc,
                prazo: prazoDoc,
                status: statusAtivo ?? true,
                versao: Number(versaoInicial).toFixed(2),
                versaoAtual: Number(versaoInicial).toFixed(2),
                criadoEm: new Date().toISOString(),
                novoStatus: novoStatus ?? "Em Andamento"
            };

            await api.post("Documentos", dadosDocumento);
            alertar("success", "Documento Cadastrado com Sucesso!");

            setNomeDoc("");
            setempresaDoc("");
            setprazoDoc("");
            listarDocumentosPorStatus();

        } catch (error) {
            alertar("error", "Erro ao criar documento!");
        }
    }

    function handleAnexarPdfChange(e) {
        const isChecked = e.target.checked;
        setAnexarPdf(isChecked);

        if (!isChecked) {
            setPdf(null);
            setNomeArquivo("");

            const inputElement = document.getElementById("arquivoInput");
            if (inputElement) inputElement.value = "";
        }
    }

    async function anexarDoc() {
        try {
            const formData = new FormData();

            formData.append("idUsuario", usuario.idUsuario);
            formData.append("idEmpresa", empresaDoc);
            formData.append("nome", nomeDoc);
            formData.append("prazo", prazoDoc);
            formData.append("status", statusAtivo ?? true);
            formData.append("versao", Number(versaoInicial).toFixed(2));
            formData.append("versaoAtual", Number(versaoInicial).toFixed(2));
            formData.append("criadoEm", new Date().toISOString());
            formData.append("novoStatus", novoStatus ?? "Em Andamento");
            formData.append("mimeType", pdf ? pdf.type : "");
            formData.append("arquivo", pdf);

            await api.post("Documentos/upload-ocr", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alertar("success", "Documento e anexo enviados com sucesso!");

            setNomeDoc("");
            setempresaDoc("");
            setprazoDoc("");
            setPdf(null);
            setNomeArquivo("");
            setAnexarPdf(false);
            listarDocumentosPorStatus();

        } catch (error) {
            alertar("error", "Erro ao enviar documento!");
        }
    }

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
                                </div>
                            ) : (
                                <p>Usuário não encontrado.</p>
                            )}
                        </div>
                    </div>

                    <div className="statusDocumentos">
                        <div
                            className="statusCard"
                            onClick={() => navigate("/Listagem?status=pendente")}
                            style={{ cursor: "pointer" }}
                        >
                            <span className="statusNum">{docsPorStatus.andamento.length}</span>
                            <span className="statusLabel">Em Andamento</span>
                        </div>

                        <div
                            className="statusCard"
                            onClick={() => navigate("/Listagem?status=finalizado")}
                            style={{ cursor: "pointer" }}
                        >
                            <span className="statusNum">{docsPorStatus.finalizados.length}</span>
                            <span className="statusLabel">Finalizados</span>
                        </div>

                        <div
                            className="statusCard"
                            onClick={() => navigate("/Listagem?status=assinado")}
                            style={{ cursor: "pointer" }}
                        >
                            <span className="statusNum">{docsPorStatus.assinados.length}</span>
                            <span className="statusLabel">Assinados</span>
                        </div>
                    </div>

                    <div className="proximaEntregas">
                        <h3>Próximas Entregas</h3>

                        {proximasEntregas.map((doc, index) => (
                            <div
                                key={doc.idDocumento}
                                className={`entregaCard ${index === 0 ? "entregaVermelho" :
                                    index === 1 ? "entregaMarrom" :
                                        "entregaBege"}`}
                            >
                                <span className="entregaNum">
                                    {new Date(doc.prazo).getDate()}
                                </span>
                                <span className="entrega-label">
                                    {doc.nome}
                                </span>
                            </div>
                        ))}
                    </div>

                    <article className="documentosActions">
                        <div className="docAction ">
                            <h4>Cadastrar Novo Documento:</h4>
                            <form onSubmit={handleSubmit} className="docActionFlex">
                                <div className='inputNomeDocumento'>
                                    <label>Nome:</label>
                                    <input
                                        type="text"
                                        placeholder="Nome do Documento"
                                        className="inputArquivo"
                                        value={nomeDoc}
                                        onChange={(e) => setNomeDoc(e.target.value)}
                                    />
                                </div>

                                <div className="botaoSelectRemententeInicio">
                                    <label>Empresa:</label>
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
                                            <option disabled>Nenhuma empresa</option>
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

                                <div className="checkboxAnexo">
                                    <input
                                        type="checkbox"
                                        id="anexarPdf"
                                        checked={anexarPdf}
                                        onChange={handleAnexarPdfChange}
                                    />
                                    <label htmlFor="anexarPdf">Deseja anexar o arquivo PDF agora?</label>
                                </div>

                                {anexarPdf && (
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
                                            placeholder="Selecione um arquivo PDF"
                                            value={nomeArquivo}
                                            disabled
                                        />
                                    </div>
                                )}

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
