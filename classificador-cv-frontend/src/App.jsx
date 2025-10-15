import { useState } from "react";
import FileUpload from "./components/FileUpload/FileUpload";
import FileExplorer from "./components/FileExplorer/FileExplorer";

export default function App() {
  const [activeTab, setActiveTab] = useState("upload");

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Classificador de Currículos</h1>

        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab("upload")}
            style={{
              ...styles.tab,
              backgroundColor:
                activeTab === "upload" ? "#3d7c3d" : "#2b2b2b",
            }}
          >
            Upload
          </button>
          <button
            onClick={() => setActiveTab("explorer")}
            style={{
              ...styles.tab,
              backgroundColor:
                activeTab === "explorer" ? "#3d7c3d" : "#2b2b2b",
            }}
          >
            Currículos
          </button>
        </div>

        <div style={styles.content}>
          {activeTab === "upload" ? <FileUpload /> : <FileExplorer />}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#121212",
    color: "#e0e0e0",
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "50px",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    backgroundColor: "#1e1e1e",
    padding: "40px",
    borderRadius: "12px",
    width: "95vw",             // ocupa 95% da largura da janela
    height: "90vh",            // ocupa quase toda a altura
    boxShadow: "0 0 15px rgba(0,0,0,0.5)",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  content: {
    backgroundColor: "#181818",
    padding: "30px",
    borderRadius: "10px",
    width: "100%",              // ocupa toda a largura do container
    height: "100%",             // ocupa toda a altura do container
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  title: {
  textAlign: "center",
  marginBottom: "30px",
  fontSize: "42px",         // aumentei bastante o título
  color: "#ffffff",
  letterSpacing: "1px",
  fontWeight: "bold",
  },

  tabs: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
    gap: "10px",
  },

  tab: {
    border: "none",
    padding: "14px 28px",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.1s",
    backgroundColor: "#2b2b2b",
    // efeito de hover
    ':hover': {
      backgroundColor: "#4caf50"
    }
  },
};