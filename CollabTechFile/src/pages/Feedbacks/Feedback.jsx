import "./Feedback.css";

import Swal from "sweetalert2";

import Lixeira from "../../assets/img/Delete.svg";
import MenuLateral from "../../components/menuLateral/MenuLateral";
import Cabecalho from "../../components/cabecalho/Cabecalho";
<<<<<<< HEAD
import { useEffect, useState } from "react";
import api from "../../Services/service";

export default function Feedback() {
    const [listaFeedBack, setListaFeedBack] = useState([]);

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
            }
        });
        Toast.fire({
            icon: icone,
            title: mensagem
        });
    }

    async function listarFeedBack() {
        try {
            const resposta = await api.get("suporte");
            setListaFeedBack(resposta.data);
        } catch (error) {
            console.log("Erro ao listar feedbacks:", error);
        }
    }

    async function deletarFeedBack(id) {
        Swal.fire({
            title: 'Tem Certeza?',
            text: "Essa ação não poderá ser desfeita!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#B51D44',
            cancelButtonColor: '#000000',
            confirmButtonText: 'Sim, apagar!',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await api.delete(`suporte/${id.idSuporte}`);
                alertar("success", "FeedBack Excluido!");
            }
        }).catch(error => {
            console.log(error);
            alertar("error", "Erro ao Excluir!");
        })
    }

    useEffect(() => {
        listarFeedBack();
    }, [listaFeedBack]);
=======
import api from "../../services/Service";
import { useEffect, useState } from "react";

export default function Feedback() {

    const [listagemFeedbacks, setListagemFeedbacks] = useState([]);

    async function listarFeedback() {
        try {
            const resposta = await api.get("/Feedbacks"); 
            setListagemFeedbacks(resposta.data);
            console.log(resposta.data);
        } catch (error) {
            console.error("Erro ao listar feedbacks:", error);
        }
    }

    useEffect(() => {
        listarFeedback();
    }, []);
>>>>>>> 12bd5f3796d46488c08fd72decd7066f736171e8

    return (
        <div className="containerGeral">
            <MenuLateral />
            <main className="conteudoPrincipal">
                <section className="areaTrabalho">
                    <Cabecalho />

                    <section className="docAndamento">
                        <div className="titulo">
                            <h1>Feedback</h1>
                        </div>

                        <div className="listaFeedbacks">
<<<<<<< HEAD
                            {listaFeedBack && listaFeedBack.length > 0 ? (
                                listaFeedBack.map((feedback, index) => (
                                    <div key={feedback.id || index} className="cardFeedback">
                                        <div className="cabecalhoFeedback">
                                            <span className="nomeFeedback">{feedback.nome}</span>
                                            <div></div>
                                            <span className="dataFeedback">{feedback.data}</span>
                                            <span className="iconeLixeira">
                                                <img
                                                    src={Lixeira}
                                                    alt="Excluir"
                                                    className="lixeiraImg"
                                                    onClick={() => deletarFeedBack(feedback)}
                                                />
                                            </span>
                                        </div>
                                        <p className="mensagemFeedback">{feedback.mensagem}</p>
                                        <hr className="linhaFeedback" />
=======
                            {listagemFeedbacks.map((feedback, card) => (
                                <div key={card} className="cardFeedback">
                                    <div className="cabecalhoFeedback">
                                        <span className="nomeFeedback">{feedback.nome}</span>
                                        <div></div>
                                        <span className="dataFeedback">{feedback.data}</span>
                                        <span className="iconeLixeira">
                                            <img
                                                src={Lixeira}
                                                alt="Excluir"
                                                className="lixeiraImg"
                                            />
                                        </span>
>>>>>>> 12bd5f3796d46488c08fd72decd7066f736171e8
                                    </div>
                                ))
                            ) : (
                                <p>Não há Feedbacks</p>
                            )}
                        </div>
                    </section>
                </section>
            </main>
        </div>
    );
}
