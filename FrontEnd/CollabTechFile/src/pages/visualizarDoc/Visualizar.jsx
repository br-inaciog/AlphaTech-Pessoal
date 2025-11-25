import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/Service";
import Documento from "../../components/documento/Documento";
import MenuLateral from "../../components/menuLateral/MenuLateral";
import Cabecalho from "../../components/cabecalho/Cabecalho";

export default function VisualizarDoc() {
  const { id } = useParams();
  const [ocrData, setOcrData] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    async function buscarOCR() {
      try {
        // 🔹 Busca o resultado do OCR
        const respostaOCR = await api.get(`/documentos/ocr-detalhado/${id}`);
        setOcrData(respostaOCR.data);

        // 🔹 Busca o PDF original (caso o backend forneça um endpoint)
        const respostaPDF = await api.get(`/documentos/${id}/arquivo`, {
          responseType: "blob",
        });
        setPdfUrl(URL.createObjectURL(respostaPDF.data));
      } catch (erro) {
        console.error("Erro ao buscar documento OCR:", erro);
      }
    }

    buscarOCR();
  }, [id]);

  return (
    <div className="containerGeral">
      <MenuLateral />
      <main className="conteudoPrincipal">
        <Cabecalho />
        <h1>Visualização de Documento</h1>

        {ocrData && pdfUrl ? (
          <Documento pdfFile={pdfUrl} ocrData={ocrData} />
        ) : (
          <p>Carregando documento...</p>
        )}
      </main>
    </div>
  );
}