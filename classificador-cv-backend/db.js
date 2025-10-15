import sqlite3 from "sqlite3";
import { open } from "sqlite";

// função que cria/abre o banco e exporta
export const db = await open({
  filename: "./database.sqlite",
  driver: sqlite3.Database,
});

// cria tabela se não existir
await db.exec(`
  CREATE TABLE IF NOT EXISTS curriculos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_arquivo TEXT,
    setor TEXT,
    caminho TEXT,
    data_upload TEXT
  );
`);