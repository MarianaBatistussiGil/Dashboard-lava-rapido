"use client";

import { useRef, useState } from "react";
import { lerPlanilha, METRICAS } from "@/lib/planilhaImport";
import { formatBRL, formatPercent, formatMultiplo } from "@/lib/format";
import Card from "@/components/ui/Card";

const FORMATADORES = {
  moeda: formatBRL,
  percentual: formatPercent,
  multiplo: formatMultiplo,
};

export default function PlanilhaImportCard() {
  const inputRef = useRef(null);
  const [nomeArquivo, setNomeArquivo] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [resultado, setResultado] = useState(null);

  async function handleArquivo(e) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    setNomeArquivo(arquivo.name);
    setCarregando(true);
    setErro(null);
    setResultado(null);
    try {
      const buffer = await arquivo.arrayBuffer();
      const metricas = await lerPlanilha(buffer);
      setResultado(metricas);
    } catch (err) {
      setErro("Não consegui ler esse arquivo como planilha .xlsx. " + (err?.message ?? ""));
    } finally {
      setCarregando(false);
    }
  }

  const encontrouAlguma = resultado && Object.values(resultado).some(Boolean);

  return (
    <Card
      title="Importar planilha"
      subtitle="Confere se o dashboard lê Enterprise Value, Equity Value, WACC e o múltiplo de qualquer planilha de valuation — útil pra testar antes da planilha real da Nogueira chegar."
      action={
        <button
          onClick={() => inputRef.current?.click()}
          className="shrink-0 rounded-lg border border-ink-600 px-3 py-1.5 text-xs font-medium text-ink-300 transition hover:border-wine-500 hover:text-white"
        >
          {nomeArquivo ? "Trocar planilha" : "Escolher planilha (.xlsx)"}
        </button>
      }
    >
      <input ref={inputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleArquivo} />

      {!nomeArquivo && <p className="text-sm text-ink-500">Nenhuma planilha carregada ainda.</p>}

      {nomeArquivo && (
        <p className="mb-3 truncate text-xs text-ink-500">
          Arquivo: <span className="text-ink-300">{nomeArquivo}</span>
        </p>
      )}

      {carregando && <p className="text-sm text-ink-400">Lendo planilha…</p>}

      {erro && <p className="text-sm text-wine-300">{erro}</p>}

      {resultado && !carregando && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {METRICAS.map((m) => {
            const achado = resultado[m.chave];
            const formatar = FORMATADORES[m.tipo];
            return (
              <div key={m.chave} className="min-w-0 rounded-xl border border-ink-800 bg-black/30 p-3">
                <p className="text-[10px] font-medium uppercase tracking-wider text-ink-500">{m.nome}</p>
                {achado ? (
                  <>
                    <p className="mt-1 truncate text-lg font-semibold text-white">{formatar(achado.valor)}</p>
                    <p className="mt-0.5 truncate text-[10px] text-ink-600">
                      {achado.local} · "{achado.rotulo}"
                    </p>
                  </>
                ) : (
                  <p className="mt-1 text-sm text-ink-600">não encontrado</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {resultado && !carregando && !encontrouAlguma && (
        <p className="mt-3 text-xs text-wine-300">
          Não achei nenhuma das 4 métricas nessa planilha — confere se ela tem linhas rotuladas "Enterprise Value",
          "Equity Value", "WACC" e "EV/EBITDA" com o valor na célula ao lado.
        </p>
      )}
    </Card>
  );
}
