import React, { useEffect, useState } from "react";
import "./FileExplorer.css";

export default function FileExplorer() {
  const [data, setData] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});

  useEffect(() => {
    fetch("http://localhost:8000/arquivos")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Erro ao carregar arquivos:", err));
  }, []);

  const toggleFolder = (key) => {
    setExpandedFolders((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Tem certeza que deseja remover este currículo?")) return;

    try {
      const res = await fetch(`http://localhost:8000/delete/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setData((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Erro ao remover currículo.");
      }
    } catch (err) {
      console.error("Erro ao remover:", err);
      alert("Falha na comunicação com o servidor.");
    }
  };

  const handleDownload = (id) => {
    window.open(`http://localhost:8000/download/${id}`, "_blank");
  };

  const handleSelectFile = (id) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDownloadSelected = (files) => {
    const selectedIds = files
      .filter((f) => selectedFiles[f.id])
      .map((f) => f.id);

    if (selectedIds.length === 0) {
      alert("Selecione ao menos um arquivo!");
      return;
    }

    // Monta URL para baixar múltiplos (você pode criar endpoint /download-zip)
    window.open(
      `http://localhost:8000/download-zip?ids=${selectedIds.join(",")}`,
      "_blank"
    );
  };

  const handleDownloadAll = (files) => {
    const allIds = files.map((f) => f.id);
    window.open(
      `http://localhost:8000/download-zip?ids=${allIds.join(",")}`,
      "_blank"
    );
  };

  // Agrupa arquivos
  const grouped = {};
  data.forEach((item) => {
    const setor = item.setor || "Inconclusivo";
    const date = new Date(item.data_upload);
    const folder = `${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;

    if (!grouped[setor]) grouped[setor] = {};
    if (!grouped[setor][folder]) grouped[setor][folder] = [];
    grouped[setor][folder].push(item);
  });

  return (
    <div className="explorer-container">
      <h2>📁 Explorar Pastas</h2>

      <div className="folder-list">
        {Object.entries(grouped).map(([setor, months]) => (
          <div key={setor} className="folder">
            <div className="folder-header" onClick={() => toggleFolder(setor)}>
              <span>{expandedFolders[setor] ? "📂" : "📁"}</span>
              <span>{setor}</span>
            </div>

            {expandedFolders[setor] && (
              <div className="subfolder-list">
                {Object.entries(months).map(([month, files]) => (
                  <div key={month} className="subfolder">
                    <div
                      className="subfolder-header"
                      onClick={() => toggleFolder(`${setor}-${month}`)}
                    >
                      <span>
                        {expandedFolders[`${setor}-${month}`] ? "📂" : "📁"}
                      </span>
                      <span>{month}</span>
                      {expandedFolders[`${setor}-${month}`] && (
                        <div className="actions">
                          <button onClick={() => handleDownloadAll(files)}>
                            ⬇️ Baixar Tudo
                          </button>
                          <button onClick={() => handleDownloadSelected(files)}>
                            ⬇️ Baixar Selecionados
                          </button>
                        </div>
                      )}
                    </div>

                    {expandedFolders[`${setor}-${month}`] && (
                      <ul className="file-list">
                        {files.map((file) => (
                          <li key={file.id} className="file-item">
                            <label>
                              <input
                                type="checkbox"
                                checked={!!selectedFiles[file.id]}
                                onChange={() => handleSelectFile(file.id)}
                              />
                              <span>📄 {file.nome_arquivo}</span>
                            </label>
                            <div className="file-actions">
                              <button onClick={() => handleDownload(file.id)}>⬇️ Baixar</button>
                              <button onClick={() => handleRemove(file.id)}>🗑️ Remover</button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}