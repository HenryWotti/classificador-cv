import React, { useState } from "react";
import "./FileUpload.css";

export default function FileUpload() {
  const [arquivos, setArquivos] = useState([]);
  const [resultado, setResultado] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (arquivos.length === 0) return alert("Selecione pelo menos um arquivo.");

    setLoading(true);
    const formData = new FormData();
    arquivos.forEach((a) => formData.append("files", a));

    try {
      const resp = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await resp.json();
      setResultado(data.resultados || []);
    } catch (err) {
      alert("Erro ao enviar arquivos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Enviar Currículos</h2>

      <div
        className="dropzone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setArquivos([...arquivos, ...Array.from(e.dataTransfer.files)]);
        }}
      >
        
        <input
          type="file"
          multiple
          accept=".pdf,.docx"
          onChange={(e) => setArquivos(Array.from(e.target.files))}
        />
      </div>

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Enviando..." : "Classificar e Enviar"}
      </button>

      {resultado.length > 0 && (
        <div className="resultado">
          <h3>Classificação:</h3>
          <ul>
            {resultado.map((r, i) => (
              <li key={i}>
                📄 {r.nome} → <strong>{r.setor}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}