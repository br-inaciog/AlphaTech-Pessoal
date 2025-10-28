import "./Lixeira.css";
import MenuLateral from "../../components/menuLateral/MenuLateral";
import Cabecalho from "../../components/cabecalho/Cabecalho";
import api from "../../services/Service";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Pdf from "../../assets/img/PDF.png";
import Restaurar from "../../assets/img/Restaurar.svg";
import Excluir from "../../assets/img/Delete.svg";

export default function Lixeira() {
    const [docLixeira, setDocLixeira] = useState([]);

    useEffect(() => {
        listarDocLixeira();
    }, []);

    async function listarDocLixeira() {
        try {
            const response = await api.get("listagemDoc/Lixeira");
            setDocLixeira(response.data);
        } catch (error) {
            console.error("Erro ao listar os documentos!");
        }
    }

    async function excluirDoc(id) {
        Swal.fire({
            title: "Excluir permanentemente?",
            text: "Você não poderá recuperar este documento depois.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, excluir!",
            cancelButtonAriaLabel: "Cancelar",
        }).then(async (result) => {
            if(result.isConfirmed) {
                try {
                    await api.delete(`listagemDoc/excluirDoc/${id}`);
                    Swal.fire("Documento excluído com sucesso", "", "success");
                    listarDocLixeira();
                } catch (error) {
                    console.error("Erro ao excluir o arquivo:", error);
                    Swal.fire("Erro!", "Não doi possível excluir o arquivo", "error");
                }
            }
        });
    }

    async function recuperarDoc(id) {
        Swal.fire({
            title: "Recuperar documento?",
            text: "O documento será restaurado para a tela principal.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sim, recuperar",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.put(`listagemDoc/recuperarDoc/${id}`);
                    Swal.fire("Documento recuperado!", "", "success");
                    listarDocLixeira(); // atualiza a tela após restaurar
                } catch (error) {
                    console.error("Erro ao recuperar o arquivo:", error);
                    Swal.fire("Erro!", "Não foi possível recuperar o arquivo.", "error");
                }
            }
        });
    }

    return (
        <div className="containerGeral">
            <MenuLateral />
            <main className="conteudoPrincipal">
                <section className="areaTrabalho">
                    <Cabecalho />

                    <div className="titulo">
                        <h1>Lixeira</h1>
                    </div>

                    <div className="cardInf">
                        {docLixeira.length > 0 ? (
                            docLixeira.map((doc) => (
                                <div key={doc.id} className="cardDocumentoLixeira">
                                    <div className="cardInformacoesLixeira">
                                        <img src={Pdf} alt="Icone de Pdf" />
                                        <p>{doc.nome || "Documento sem nome"}</p>
                                    </div>

                                    <div className="cardAcoesLixeira">
                                        <div className="lixeiraExcluir">
                                            <img
                                                className="lixeiraIco"
                                                src={Restaurar}
                                                alt="Restaurar"
                                                onClick={() => recuperarDoc(doc.id)}
                                                style={{ cursor: "pointer" }}
                                            />
                                            <img
                                                src={Excluir}
                                                alt="Excluir permanentemente"
                                                onClick={() => excluirDoc(doc.id)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        </div>

                                        <div className="info">
                                            <p className="infHorarioCard">
                                                Excluído em:{" "}
                                                <span>
                                                    {doc.dataExclusao
                                                        ? new Date(doc.dataExclusao).toLocaleDateString()
                                                        : "--/--/----"}
                                                </span>{" "}
                                                <span>
                                                    {doc.dataExclusao
                                                        ? new Date(doc.dataExclusao).toLocaleTimeString()
                                                        : "--:--"}
                                                </span>
                                            </p>
                                            <p>
                                                Por: <span>{doc.usuarioExclusao || "Desconhecido"}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="semDocumentos">Nenhum documento na lixeira.</p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
