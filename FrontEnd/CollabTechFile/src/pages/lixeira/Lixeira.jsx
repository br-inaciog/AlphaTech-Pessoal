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

    const alertar = (icone, mensagem) => {
        Swal.fire({
            icon: icone,
            title: mensagem,
            theme: 'dark',
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
        });
    };

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
            theme: "dark",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, excluir",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`Documentos/Excluir/${id}`);
                    alertar("success", "O documento foi excluido permanentemente!");
                    listarDocLixeira();
                } catch (error) {
                    console.error("Erro ao excluir:", error);
                    alertar("error", "Não foi possível excluir o documento.");
                }
            }
        });
    }

    async function recuperarDoc(id) {
        Swal.fire({
            title: "Restaurar documento?",
            theme: "dark",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sim, restaurar",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.put(`Documentos/Restaurar/${id}`);
                    alertar("success", "O documento voltou para a listagem.");
                    listarDocLixeira();
                } catch (error) {
                    console.error("Erro ao restaurar:", error);
                    alertar("error", "Não foi possível restaurar o documento.");
                }
            }
        });
    }

    useEffect(() => {
        listarDocLixeira();
    }, []);

    return (
        <div className="containerGeral">
            <MenuLateral />
            <main className="conteudoPrincipal">
                <section className="areaTrabalho">
                    <Cabecalho />

                    <div className="titulo">
                        <h1>Lixeira</h1>
                    </div>

                    <div className="    ">
                        {docLixeira.length > 0 ? (
                            docLixeira.map((doc) => (
                                <div className="cardDocumento">
                                    < img src={Pdf} alt="Icone de Pdf" />
                                    <div className="cardInformacoes">
                                        <h1>{doc.nome || "Sem título"}</h1>
                                        <p>Prazo: <span>{new Date(doc.criadoEm).toLocaleDateString('pt-BR') || "Sem data"}</span></p>
                                        <p>Versão: <span>{doc.versaoAtual || "Sem Versão"}</span></p>
                                        <p>Autor: <span>{doc.usuarioNavigation?.nome || "Autor desconhecido"}</span></p>
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
        </div >
    );
}
