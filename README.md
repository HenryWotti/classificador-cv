# 🧠 Classificador de Currículos

Um sistema completo para **upload, classificação automática, organização e gerenciamento de currículos** de candidatos.  
Desenvolvido em **React + Node.js + SQLite**, o app identifica automaticamente o setor ideal (Financeiro, RH, Operacional, etc.) com base no conteúdo do arquivo PDF/DOCX, e organiza tudo por **setor e mês/ano**.

---

## 🚀 Funcionalidades Principais

✅ Upload de múltiplos arquivos PDF ou DOCX  
✅ Classificação automática de currículos com base em palavras-chave  
✅ Organização por setor e mês/ano  
✅ Visualização hierárquica estilo “Explorador de Currículos”  
✅ Download individual, múltiplo ou completo de pastas  
✅ Exclusão de currículos diretamente pela interface  
✅ Armazenamento persistente em banco SQLite  

---

## 🧩 Estrutura do Projeto

```bash
classificador-cv/
│
├── classificador-cv-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload/
│   │   │   │   ├── FileUpload.jsx
│   │   │   │   └── FileUpload.css
│   │   │   └── FileExplorer/
│   │   │       ├── FileExplorer.jsx
│   │   │       └── FileExplorer.css
│   │   └── App.jsx
│   ├── package.json
│   └── ...
│
├── classificador-cv-backend/
│   ├── server.js
│   ├── classify.js
│   ├── db.js
│   ├── storage/
│   ├── package.json
│   └── curriculos.db
│
└── README.md
```

---

## ⚙️ Instalação e Execução

### 1️⃣ Clonar o projeto

```bash
git clone https://github.com/seu-usuario/classificador-cv.git
cd classificador-cv
```

### 2️⃣ Instalar Dependências

Backend
```bash
cd classificador-cv-backend
npm install
```

Frontend
```bash
cd ../classificador-cv-frontend
npm install
```

### 3️⃣ Executar o servidor backend

```bash
cd ../classificador-cv-backend
node server.js
```

O servidor rodará em:
👉 http://localhost:8000

### 4️⃣ Executar o frontend React

```bash
cd ../classificador-cv-frontend
npm run dev
```
O frontend rodará em:
👉 http://localhost:5173

---

## 🧠 Classificação Automática

A lógica de classificação utiliza palavras-chave agrupadas por **setor** (Financeiro, RH, Tecnologia, etc.).  
Cada setor possui listas de termos **fortes** e **médios**, com pesos diferentes na contagem final.  
O texto dos currículos é **normalizado** (acentos e maiúsculas removidos) antes da análise.

O resultado é armazenado no banco e usado para determinar o caminho final:
/storage/<Setor>/<Mês-Ano>/<arquivo>.pdf

---

## 💾 Banco de Dados (SQLite)

Tabela principal: `curriculos`

| Campo         | Tipo     | Descrição                          |
|----------------|----------|------------------------------------|
| id             | INTEGER  | Identificador único                |
| nome_arquivo   | TEXT     | Nome original do arquivo           |
| setor          | TEXT     | Setor classificado automaticamente |
| caminho        | TEXT     | Caminho físico do arquivo          |
| data_upload    | TEXT     | Data/hora do upload                |

---

## 🎨 Interface

A interface foi desenvolvida em **React puro com CSS**, tema **dark** e design responsivo.  
As seções principais são:

- **Upload:** Envio de múltiplos arquivos com barra de status  
- **Currículos:** Visualização em pastas, downloads e exclusão  

---

## 🔐 Segurança

- Upload controlado via `multer`  
- Sanitização básica de nomes de arquivos  
- Limite de tipos aceitos (`.pdf`, `.docx`)  
- Diretório `storage/` isolado por setor  

---

## 📦 Dependências Principais

### Backend
- express  
- cors  
- multer  
- sqlite3  
- pdfjs-dist  
- mammoth  
- unidecode  

### Frontend
- react  
- vite  

---

## 💡 Próximas Evoluções (Sugestões)

- 🔍 Busca por nome do candidato  
- 📈 Painel de estatísticas de uploads por setor  
- 👤 Login com permissões de RH  
- 📂 Exportação automática para ZIP de setor/mês  
- ☁️ Integração com nuvem (Drive, OneDrive, etc.)  

---

## 👨‍💻 Autor

- **Desenvolvido por:** Henrycky Wottikosky da Fonceca
- 📍 Projeto interno de automação de triagem de currículos  
- 📅 **Versão:** 1.0.0  
