import Documento from "../../components/documento/Documento";
import api from "../../services/Service";
import { useState } from "react";

export default function UploadOCR() {
  const [file, setFile] = useState(null);
  const [ocrData, setOcrData] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("arquivo", file);

    const response = await api.post("/ocr/ocr-detalhado", formData);
    setOcrData(response.data);
  };

  return (
    <div className="p-4">
      <h1>Visualizador de Documento OCR</h1>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload}>Enviar</button>

      {ocrData && file && <Documento pdfFile={file} ocrData={ocrData} />}
    </div>
  );
}
