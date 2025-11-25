import "./Lixeira.css";
import MenuLateral from "../../components/menuLateral/MenuLateral";
import Cabecalho from "../../components/cabecalho/Cabecalho";
import api from "../../Services/service";
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
            const response = await api.get("Documentos/Lixeira");
            setDocLixeira(response.data);
        } catch (error) {
            console.error("Erro ao listar os documentos:", error);
        }
    }

    async function excluirDoc(id) {
        Swal.fire({
            title: "Excluir permanentemente?",
            text: "Este documento não poderá ser recuperado depois.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, excluir",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`Documentos/Excluir/${id}`);
                    Swal.fire("Excluído!", "O documento foi removido definitivamente.", "success");
                    listarDocLixeira();
                } catch (error) {
                    console.error("Erro ao excluir:", error);
                    Swal.fire("Erro", "Não foi possível excluir o documento.", "error");
                }
            }
        });
    }

    async function recuperarDoc(id) {
        Swal.fire({
            title: "Restaurar documento?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sim, restaurar",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.put(`Documentos/Restaurar/${id}`);
                    Swal.fire("Restaurado!", "O documento voltou para a listagem.", "success");
                    listarDocLixeira();
                } catch (error) {
                    console.error("Erro ao restaurar:", error);
                    Swal.fire("Erro", "Não foi possível restaurar o documento.", "error");
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
                                <div key={doc.idDocumento} className="cardDocumentoLixeira">
                                    <div className="cardInformacoesLixeira">
                                        <img src={Pdf} alt="PDF" />
                                        <p>{doc.nome || "Documento sem nome"}</p>
                                    </div>

                                    <div className="cardAcoesLixeira">
                                        <img
                                            src={Restaurar}
                                            alt="Restaurar"
                                            onClick={() => recuperarDoc(doc.idDocumento)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        <img
                                            src={Excluir}
                                            alt="Excluir"
                                            onClick={() => excluirDoc(doc.idDocumento)}
                                            style={{ cursor: "pointer" }}
                                        />
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
