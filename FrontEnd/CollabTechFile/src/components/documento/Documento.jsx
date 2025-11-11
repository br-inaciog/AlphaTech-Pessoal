import "./Documento.css";

export default function ModalPDF({ pdfUrl, onClose }) {
  return (
    <div className="modal-pdf">
      <div className="overlay" onClick={onClose}></div>

      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <iframe
          src={pdfUrl}
          type="application/pdf"
          title="Documento PDF"
          width="100%"
          height="100%"
        ></iframe>
      </div>
    </div>
  );
}
