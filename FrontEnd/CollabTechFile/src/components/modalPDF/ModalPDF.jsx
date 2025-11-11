import { useState } from "react";
import "./ModalPDF.css";

const ModalPDF = ({ urlPDF, onClose }) => {
  if (!urlPDF) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <iframe
          src={urlPDF}
          width="100%"
          height="600px"
          title="Visualizador PDF"
          style={{ border: "none" }}
        ></iframe>
      </div>
    </div>
  );
};

export default ModalPDF;