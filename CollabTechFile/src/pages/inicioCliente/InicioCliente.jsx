import "./InicioCliente.css"

import MenuLateralCliente from "../../components/menuLateralCliente/MenuLateralCliente"
import CabecalhoCliente from "../../components/cabecalhoCliente/CabecalhoCliente"

import Pdf from "../../assets/img/PDF.png"

import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../../services/Service"

export default function InicioCliente() {
    const [listaDoc, setListaDoc] = useState([]);

    async function listarDocumentos() {
        try {
            const resposta = await api.get("Documentos")
            setListaDoc(resposta.data);
            console.log(resposta.data);
        } catch (error) {
            console.error("Erro ao listar documentos:", error);
        }
    }

    useEffect(() => {
        listarDocumentos();
    }, []);

    return (
        <div className="containerGeral'">
            <MenuLateralCliente />
            <main className="conteudoPrincipal">
                <section className="areaTrabalho">
                    <CabecalhoCliente />

                    <div className="titulo">
                        <h1>Documentos</h1>
                    </div>

                    <div className="botaoFiltraLixeira">
                        <div className="botaoFiltrar">
                            <select defaultValue="">
                                <option value="" disabled>Filtrar</option>
                                <option value="Pendentes">Pendentes</option>
                                <option value="Assinados">Assinados</option>
                                <option value="Finalizados">Finalizados</option>
                            </select>
                        </div>
                    </div>

                    <section className="list">
                        {listaDoc.length > 0 ? (
                            listaDoc.map((doc) => (

                                <Link to={`/DocAndamentoClie/${doc.nome}`} className="cardDocumento">
                                    <img src={Pdf} alt="Icone de Pdf" />
                                    <div className="cardInformacoes">
                                        <h1>{doc.nome || "Sem título"}</h1>
                                        <p>{new Date(doc.criadoEm).toLocaleDateString('pt-BR') || "Sem data"}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p>Nenhum documento encontrado.</p>
                        )}
                    </section>

                </section>
            </main>
        </div>
    )
}