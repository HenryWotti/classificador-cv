import unidecode from "unidecode";
import { createRequire } from "module";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// aponta para as fontes padrão do PDF.js
GlobalWorkerOptions.standardFontDataUrl = path.join(__dirname, "node_modules/pdfjs-dist/standard_fonts/");

// importa pdf-parse compatível com CommonJS
//const pdfParse = require("pdf-parse").default || require("pdf-parse");

// ===============================
// Extração de texto de PDF
// ===============================
export async function extractTextFromPdf(buffer) {
  try {
    // converte Buffer do Node em Uint8Array
    const uint8Array = new Uint8Array(buffer);


    const loadingTask = getDocument({ data: uint8Array });
    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n";
    }

    return fullText;
  } catch (err) {
    console.error("Erro ao extrair texto do PDF:", err);
    return "";
  }
}

// ===============================
// Normalização do texto
// ===============================
export function normalize(text) {
  text = unidecode(text.toLowerCase());
  text = text.replace(/\s+/g, " ");
  return text;
}

export const KEYWORDS = {
    "Fiscal": {
      strong: ["fiscal", "sped", "efd", "efd icms ipi", "efd contribuicoes", "icms", "pis", "cofins", "ncm", "cfop", "sefaz", "ecf", "ecd", "dctfweb", "substituicao tributaria"],
      medium: ["nfe", "nfse", "danfe", "gnre", "apurar impostos", "apuracao de impostos", "classificacao fiscal", "athenas300", "sinnfe"],
    },
    "Faturamento": {
      strong: ["faturamento", "contas a receber", "remessa cnab", "arquivo remessa", "arquivo retorno", "retorno cnab", "baixa de titulos", "bordero", "protesto", "cobranca registrada", "cobranca sem registro","entrada de pedido", "liberacao", "liberacao de pedido", "pedido de venda"],
      medium: ["boleto", "duplicata", "danfe", "nota de saida", "emissao de nota", "nfe", "geracao de boletos", "envio de remessa", "baixa automatica", "conferencia de notas"],
    },
    "Financeiro": {
      strong: ["contas a pagar", "conciliação bancaria", "fluxo de caixa", "tesouraria", "pagamentos", "financeiro", "rateio de despesas", "adiantamento", "reembolso", "provisao de despesas"],
      medium: ["contas a receber", "bordero", "pix", "lançamento contábil", "fechamento de caixa", "controle de despesas", "centro de custo"],
    },
    "Recursos Humanos": {
      strong: ["folha de pagamento", "recurso humoanos", "rh", "e-social", "e social", "admissao", "rescisao", "ferias", "beneficios", "recrutamento", "selecao", "ponto", "cartao de ponto", "holerite", "controle de jornada", "vale transporte", "vale alimentacao", "plano de saude"],
      medium: ["treinamento", "avaliacao de desempenho", "cargos e salarios", "motivacao", "integracao", "clima organizacional", "recrutamento interno", "entrevista", "cadastro de funcionarios"],
    },
    "Segurança do Trabalho": {
      strong: ["ppra", "pcmso", "aso", "epi", "epc", "cat", "seguranca do trabalho", "cipa", "laudo tecnico", "insalubridade", "periculosidade", "brigada de incendio", "nr", "nr6", "nr7", "nr9", "nr12", "nr35"],
      medium: ["treinamento de seguranca", "integracao de seguranca", "sipat", "controle de epi", "exames ocupacionais", "medicina do trabalho", "laudo ergonômico", "mapa de risco", "gestao de risco"],
    },
    "Tecnologia": {
      strong: ["programacao", "desenvolvimento", "javascript", "typescript", "python", "java", "c#", "csharp", "sql", "html", "css", "react", "node", "angular", "php", "infraestrutura", "rede", "suporte tecnico", "help desk", "banco de dados", "api", "devops", "cloud", "automacao", "manutencao de sistemas"],
      medium: ["power bi", "azure", "aws", "google cloud", "totvs", "protheus", "mysql", "postgres", "oracle", "sql server", "versionamento", "analise de sistemas", "documentacao tecnica", "hardware", "software", "instalacao de sistemas", "seguranca da informacao"],
    },
    "Comercial": {
      strong: ["comercial", "vendas", "compras", "prospeccao", "negociacao", "cliente", "fornecedor", "orcamento", "cotacao", "pedido de venda", "pedido de compra", "meta", "comissao", "crm", "pós-venda", "pos-venda", "representante comercial", "atendimento ao cliente", "captacao de clientes", "relacionamento comercial", "expansao de mercado", "fechamento de venda"],
      medium: ["tabela de preco", "margem de lucro", "markup", "nota fiscal", "emissao de pedido", "follow up", "pipeline", "proposta comercial", "relatorio de vendas", "planejamento comercial", "reuniao com cliente", "indicadores comerciais"],
    },
    "Administrativo": {
      strong: ["rotinas administrativas", "emissao de notas fiscais", "arquivo de documentos", "controle de planilhas", "cadastro de clientes", "cadastro de fornecedores", "controle de estoque", "compras administrativas", "gestao de contratos", "controle de correspondencias", "contato com fornecedores", "organizacao de documentos", "lancamentos no sistema", "controle de agendas", "atendimento telefonico", "relatorios administrativos"],
      medium: ["pacote office", "organizacao", "planejamento", "assistente administrativo", "auxiliar administrativo", "secretaria", "arquivo fisico", "atendimento interno", "controle de materiais de escritorio", "recepcao"],
    },
    "Frotas": {
      strong: ["frotas", "motorista", "caminhao", "veiculo", "carreta", "rota", "roteirizacao", "entrega", "logistica", "rastreamento", "telemetria", "manutencao de veiculos", "abastecimento", "controle de km", "tacografo", "ct-e", "mdfe", "licenciamento", "seguro de frota", "documentacao veicular", "gestao de frotas", "gestao de motoristas", "checklist de veiculo", "inspecao veicular", "motorista de caminhão", "motorista truck", "veículo", "frotas", "caminhão", "rota", "entrega", "carreta", "transporte", "logística", "rastreamento", "transporte de passageiros", "transporte coletivo", "condutor", "habilitação", "categoria e", "carteira nacional de habilitação"],
      medium: ["escala de motoristas", "controle de multas", "controle de manutencao", "controle de abastecimento", "oficina", "monitoramento de rotas", "agendamento de manutencao", "rotas de entrega", "viagem", "controle de pneus", "cadastro de veiculos", "cadastro de motoristas", "controle de abastecimento", "controle de rastreadores", "controle de revisao"],
    },
    "Operacional": {
      strong: ["operacional", "carregador", "separador", "embalador", "operador de empilhadeira", "empilhadeira", "conferente", "expedicao", "estoque", "armazenagem", "logistica", "palete", "carga e descarga", "montagem de pedidos", "organizacao de mercadorias", "movimentacao de mercadorias", "controle de saida", "controle de entrada", "balanca", "rotina de patio", "centro de distribuicao", "cd", "promotor", "abastecimento de gôndola", "repositor", "visita a supermercados"],
      medium: ["limpeza", "separacao de pedidos", "rotulagem", "embalagem", "identificacao de volumes", "controle de qualidade", "conferencia de pedidos", "apoio a expedicao", "operacao de paleteira", "descarga de caminhão", "movimentacao de caixas", "controle de estoque fisico", "organizacao do deposito", "etiquetagem", "recebimento de mercadorias", "verificacao de produtos", "apoio logistico"],
    },
  };

  // ===============================
// Classificação baseada em keywords
// ===============================
export function classify(text) {
  // normaliza e limpa termos que causam falsos positivos
  let cleanText = text.toLowerCase();
  cleanText = cleanText.replace(/comercial\s+[a-z0-9]+/gi, ""); // evita "Comercial Diskpan"

  const scores = {};

  for (const [setor, { strong, medium }] of Object.entries(KEYWORDS)) {
    scores[setor] = 0;

    // conta repetições das palavras strong
    strong.forEach((kw) => {
      const matches = cleanText.match(new RegExp(`\\b${kw}\\b`, "gi"));
      if (matches) scores[setor] += matches.length * 3;
    });

    // conta repetições das palavras medium
    medium.forEach((kw) => {
      const matches = cleanText.match(new RegExp(`\\b${kw}\\b`, "gi"));
      if (matches) scores[setor] += matches.length * 1;
    });
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [melhor, segundo] = sorted;
  const gap = melhor[1] - (segundo ? segundo[1] : 0);
  const setorFinal = melhor[1] === 0 ? "Inconclusivo" : melhor[0];

  return { setor: setorFinal, score: melhor[1], gap, scores };
}