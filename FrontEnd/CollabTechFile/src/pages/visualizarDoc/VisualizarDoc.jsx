import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/Service";
import "./VisualizarDoc.css";

export default function VisualizarDocumento() {

    const { id } = useParams();
    const [texto, setTexto] = useState("");
    const [nome, setNome] = useState("");
    const [pdfUrl, setPdfUrl] = useState("");
    const [editando, setEditando] = useState(false);

    async function carregarDocumento() {
        try {
            const resposta = await api.get(`/Documentos/${id}/ocr`);

            setTexto(resposta.data.texto || "");
            setNome(resposta.data.nome);

            setPdfUrl(`${import.meta.env.VITE_API_URL}/Documentos/${id}/pdf`);

        } catch (error) {
            console.error("Erro ao carregar documento", error);
        }
    }

    async function salvarEdicao() {
        try {
            await api.put(`/Documentos/${id}/editar-ocr`, texto, {
                headers: { "Content-Type": "application/json" }
            });

            setEditando(false);
            alert("Texto atualizado com sucesso!");

        } catch (error) {
            console.error("Erro ao salvar edição", error);
        }
    }

    useEffect(() => {
        carregarDocumento();
    }, []);

    return (
        <div className="visualizarDoc-container">

            <h1>{nome}</h1>

            <div className="visualizarDoc-content">

                {/* PDF à esquerda */}
                <iframe
                    src={pdfUrl}
                    className="pdfViewer"
                    title="Visualização PDF"
                />

                {/* OCR à direita */}
                <div className="textoOcr">
                    <h2>Texto Extraído (OCR)</h2>

                    {editando ? (
                        <textarea
                            value={texto}
                            onChange={(e) => setTexto(e.target.value)}
                        />
                    ) : (
                        <p className="textoDisplay">{texto}</p>
                    )}

                    <div className="botoes">
                        {!editando && (
                            <button onClick={() => setEditando(true)}>
                                Editar
                            </button>
                        )}

                        {editando && (
                            <>
                                <button onClick={salvarEdicao}>Salvar</button>
                                <button onClick={() => setEditando(false)}>Cancelar</button>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}