// Leitura genérica de planilhas de valuation (.xlsx) no client, sem backend.
// Não assume a estrutura de nenhuma planilha específica: varre todas as células de
// todas as abas procurando rótulos conhecidos (em português e inglês) e lê o primeiro
// valor numérico perto deles. Duas passadas: primeiro só rótulos que COMEÇAM com um
// termo forte (mais preciso, evita pegar uma célula errada por coincidência), depois —
// só para o que ainda não achou — qualquer célula que CONTENHA o termo em qualquer
// posição (mais permissivo, pega rótulos frasados de outro jeito).

import * as XLSX from "xlsx";

export const METRICAS = [
  {
    chave: "enterpriseValue",
    nome: "Enterprise Value",
    fortes: ["enterprise value", "ev "],
    fracos: ["valor da empresa", "valor de empresa", "valor empresarial", "valor da firma"],
    tipo: "moeda",
  },
  {
    chave: "equityValue",
    nome: "Equity Value",
    fortes: ["equity value"],
    fracos: [
      "valor do patrimonio liquido",
      "valor do patrimonio",
      "valor do acionista",
      "valor para o acionista",
      "valor do equity",
      "valor das acoes",
    ],
    tipo: "moeda",
  },
  {
    chave: "wacc",
    nome: "WACC",
    fortes: ["wacc"],
    fracos: ["custo medio ponderado de capital", "custo de capital"],
    tipo: "percentual",
  },
  {
    chave: "multiplo",
    nome: "Múltiplo EV/EBITDA",
    fortes: ["ev/ebitda", "ev / ebitda", "multiplo implicito", "multiplo ev"],
    fracos: ["multiplo ev/ebitda", "multiplo"],
    tipo: "multiplo",
  },
];

function normalizar(texto) {
  return String(texto)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

// Converte texto tipo "R$ 5.559.324", "23,4%" ou "2,75x" num number. Só aceita se a
// célula INTEIRA for esse formato — rejeita qualquer texto com outras palavras/letras
// misturadas, pra não confundir um rótulo que só por acaso contém um dígito (tipo
// "EBITDA do último ano projetado (Ano 4)") com um valor de verdade. Assume convenção
// brasileira (ponto = milhar, vírgula = decimal) quando aparecem juntos ou só vírgula
// aparece; se só tem ponto(s), trata como separador de milhar.
function tentarParsearNumero(texto) {
  if (typeof texto === "number") return texto;
  if (typeof texto !== "string") return null;
  const t = texto.trim();
  if (!/^-?(r\$)?\s*[\d.,]+\s*(%|x)?$/i.test(t)) return null;
  let limpo = t.replace(/[^\d,.\-]/g, "");
  if (!limpo || !/\d/.test(limpo)) return null;
  if (limpo.includes(",")) {
    limpo = limpo.replace(/\./g, "").replace(",", ".");
  } else if ((limpo.match(/\./g) || []).length > 1) {
    limpo = limpo.replace(/\./g, "");
  }
  const n = parseFloat(limpo);
  return Number.isFinite(n) ? n : null;
}

function valorNumericoDaCelula(cell) {
  if (!cell) return null;
  if (typeof cell.v === "number") return cell.v;
  if (typeof cell.v === "string") return tentarParsearNumero(cell.v);
  return null;
}

// Procura um valor numérico perto da célula de rótulo (r,c): primeiro nas células à
// direita na mesma linha, depois na célula logo abaixo — cobre os dois layouts mais
// comuns ("rótulo | valor" e rótulo em cima, valor embaixo).
function acharValorPerto(sheet, r, c, range) {
  for (let c2 = c + 1; c2 <= range.e.c; c2++) {
    const v = valorNumericoDaCelula(sheet[XLSX.utils.encode_cell({ r, c: c2 })]);
    if (v != null) return { valor: v, endereco: XLSX.utils.encode_cell({ r, c: c2 }) };
  }
  const abaixo = valorNumericoDaCelula(sheet[XLSX.utils.encode_cell({ r: r + 1, c })]);
  if (abaixo != null) return { valor: abaixo, endereco: XLSX.utils.encode_cell({ r: r + 1, c }) };
  return null;
}

function varrer(workbook, resultado, matcher) {
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet["!ref"]) continue;
    const range = XLSX.utils.decode_range(sheet["!ref"]);

    for (let r = range.s.r; r <= range.e.r; r++) {
      for (let c = range.s.c; c <= range.e.c; c++) {
        const cell = sheet[XLSX.utils.encode_cell({ r, c })];
        if (!cell || typeof cell.v !== "string") continue;
        const rotuloNormalizado = normalizar(cell.v);

        for (const metrica of METRICAS) {
          if (resultado[metrica.chave]) continue; // mantém a primeira ocorrência válida
          if (!matcher(rotuloNormalizado, metrica)) continue;

          const achado = acharValorPerto(sheet, r, c, range);
          if (achado) {
            resultado[metrica.chave] = {
              valor: achado.valor,
              local: `${sheetName}!${achado.endereco}`,
              rotulo: cell.v.trim(),
            };
          }
        }
      }
    }
  }
}

// Extrai as métricas de um workbook já parseado pelo SheetJS (XLSX.read).
export function extrairMetricas(workbook) {
  const resultado = {};
  METRICAS.forEach((m) => (resultado[m.chave] = null));

  // Passada 1: precisa (rótulo começa com um termo forte).
  varrer(workbook, resultado, (rotulo, metrica) => metrica.fortes.some((p) => rotulo.startsWith(p)));

  // Passada 2 (só para o que sobrou): permissiva (termo em qualquer posição do rótulo,
  // forte ou fraco).
  varrer(workbook, resultado, (rotulo, metrica) =>
    [...metrica.fortes, ...metrica.fracos].some((p) => rotulo.includes(p))
  );

  return resultado;
}

export async function lerPlanilha(arrayBuffer) {
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  return extrairMetricas(workbook);
}
