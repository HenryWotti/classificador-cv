import express from "express";
import multer from "multer";
import { createRequire } from "module";
import { db } from "./db.js";
import { classify, extractTextFromPdf, normalize } from "./classify.js";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import archiver from "archiver";
import iconv from "iconv-lite";
import { Buffer } from "buffer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// === DOCX parser ===
const docx = require("docx");
const mammoth = require("mammoth");

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do multer (buffer em memória)
const upload = multer({ storage: multer.memoryStorage() });

// ===============================
// Função auxiliar para DOCX
// ===============================
async function extractTextFromDocx(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  } catch (err) {
    console.error("Erro ao extrair texto do DOCX:", err);
    return "";
  }
}

// ===============================
// ROTA: Upload + classificação
// ===============================
app.post("/upload", upload.array("files"), async (req, res) => {
  try {
    const results = [];

    for (const file of req.files) {
      let text = "";

      if (file.originalname.toLowerCase().endsWith(".pdf")) {
        text = await extractTextFromPdf(file.buffer);
      } else if (file.originalname.toLowerCase().endsWith(".docx")) {
        text = await extractTextFromDocx(file.buffer);
      } else {
        console.warn("Formato não suportado:", file.originalname);
        continue;
      }

      const normalized = normalize(text);
      const { setor } = classify(normalized);
      const now = new Date().toISOString();

      const dir = path.join(__dirname, "storage", setor);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      // ✅ Corrige nome do arquivo com acentuação
      const decodedName = iconv.decode(Buffer.from(file.originalname, "binary"), "utf8");
      const fname = decodedName.normalize("NFC"); // normaliza acentos

      const savePath = path.join(dir, `${Date.now()}_${fname}`);
      fs.writeFileSync(savePath, file.buffer);

      await db.run(
        "INSERT INTO curriculos (nome_arquivo, setor, caminho, data_upload) VALUES (?, ?, ?, ?)",
        [fname, setor, savePath, now]
      );

      results.push({ nome: fname, setor, caminho: savePath });
    }

    res.json({ sucesso: true, resultados: results });
  } catch (err) {
    console.error("Erro geral:", err);
    res.status(500).json({ erro: err.message });
  }
});

// ===============================
// ROTA: Listar currículos
// ===============================
app.get("/arquivos", async (req, res) => {
  const arquivos = await db.all("SELECT * FROM curriculos ORDER BY data_upload DESC");
  res.json(arquivos);
});

// ===============================
// ROTA: Download por ID
// ===============================
app.get("/download/:id", async (req, res) => {
  const curriculo = await db.get("SELECT * FROM curriculos WHERE id = ?", [
    req.params.id,
  ]);
  if (!curriculo) return res.status(404).send("Arquivo não encontrado");
  res.download(curriculo.caminho);
});

app.get("/download-zip", async (req, res) => {
  const ids = req.query.ids?.split(",").map((id) => parseInt(id.trim()));
  if (!ids?.length) return res.status(400).send("Nenhum arquivo informado.");

  const arquivos = await db.all(
    `SELECT * FROM curriculos WHERE id IN (${ids.map(() => "?").join(",")})`,
    ids
  );

  if (!arquivos.length) return res.status(404).send("Nenhum arquivo encontrado.");

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", 'attachment; filename="curriculos.zip"');

  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.pipe(res);

  for (const arq of arquivos) {
    archive.file(arq.caminho, { name: arq.nome_arquivo });
  }

  archive.finalize();
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const curriculo = await db.get("SELECT * FROM curriculos WHERE id = ?", [
      req.params.id,
    ]);

    if (!curriculo) {
      return res.status(404).json({ erro: "Currículo não encontrado" });
    }

    // Remove o arquivo do sistema
    if (fs.existsSync(curriculo.caminho)) {
      fs.unlinkSync(curriculo.caminho);
    }

    // Remove do banco
    await db.run("DELETE FROM curriculos WHERE id = ?", [req.params.id]);

    res.json({ sucesso: true });
  } catch (err) {
    console.error("Erro ao remover currículo:", err);
    res.status(500).json({ erro: "Erro interno ao remover currículo" });
  }
});

// ===============================
// Inicialização
// ===============================
app.listen(8000, () =>
  console.log("✅ Servidor rodando em http://localhost:8000")
);