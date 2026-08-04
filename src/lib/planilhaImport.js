// Leitura genérica de planilhas de valuation (.xlsx) no client, sem backend.
// Não assume a estrutura de nenhuma planilha específica: varre todas as células de
// todas as abas procurando rótulos conhecidos (Enterprise Value, Equity Value, WACC,
// múltiplo EV/EBITDA) e lê o primeiro valor numérico à direita, na mesma linha. Assim
// funciona tanto com uma planilha de teste quanto com a planilha real, desde que ela
// siga a convenção comum de "rótulo na coluna, valor ao lado".

import * as XLSX from "xlsx";

export const METRICAS = [
  { chave: "enterpriseValue", nome: "Enterprise Value", padroes: ["enterprise value"], tipo: "moeda" },
  { chave: "equityValue", nome: "Equity Value", padroes: ["equity value"], tipo: "moeda" },
  { chave: "wacc", nome: "WACC", padroes: ["wacc"], tipo: "percentual" },
  {
    chave: "multiplo",
    nome: "Múltiplo EV/EBITDA",
    padroes: ["ev/ebitda", "multiplo implicito", "multiplo ev"],
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

// Extrai as métricas de um workbook já parseado pelo SheetJS (XLSX.read).
export function extrairMetricas(workbook) {
  const resultado = {};
  METRICAS.forEach((m) => (resultado[m.chave] = null));

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
          const bateu = metrica.padroes.some((p) => rotuloNormalizado.startsWith(p));
          if (!bateu) continue;

          for (let c2 = c + 1; c2 <= range.e.c; c2++) {
            const vizinho = sheet[XLSX.utils.encode_cell({ r, c: c2 })];
            if (vizinho && typeof vizinho.v === "number") {
              resultado[metrica.chave] = {
                valor: vizinho.v,
                local: `${sheetName}!${XLSX.utils.encode_cell({ r, c: c2 })}`,
                rotulo: cell.v.trim(),
              };
              break;
            }
          }
        }
      }
    }
  }

  return resultado;
}

export async function lerPlanilha(arrayBuffer) {
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  return extrairMetricas(workbook);
}
