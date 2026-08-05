"use client";

import { useRef, useState } from "react";
import { lerPlanilha } from "@/lib/planilhaImport";
import Card from "@/components/ui/Card";

export default function PlanilhaImportCard({ importado, onImportar, onLimpar }) {
  const inputRef = useRef(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  async function handleArquivo(e) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    setCarregando(true);
    setErro(null);
    try {
      const buffer = await arquivo.arrayBuffer();
      const resultado = await lerPlanilha(buffer);
      onImportar(resultado, arquivo.name);
    } catch (err) {
      setErro("Não consegui ler esse arquivo como planilha .xlsx. " + (err?.message ?? ""));
    } finally {
      setCarregando(false);
      e.target.value = "";
    }
  }

  return (
    <Card
      title="Importar planilha"
      subtitle="Enquanto carregada, os KPIs abaixo mostram só os números dessa planilha — não o modelo interativo dos sliders."
      action={
        <div className="flex shrink-0 items-center gap-2">
          {importado && (
            <button
              onClick={onLimpar}
              className="rounded-lg border border-ink-600 px-3 py-1.5 text-xs font-medium text-ink-300 transition hover:border-blue-500 hover:text-white"
            >
              Usar modelo interativo
            </button>
          )}
          <button
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-ink-600 px-3 py-1.5 text-xs font-medium text-ink-300 transition hover:border-blue-500 hover:text-white"
          >
            {importado ? "Trocar planilha" : "Escolher planilha (.xlsx)"}
          </button>
        </div>
      }
    >
      <input ref={inputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleArquivo} />

      {!importado && !carregando && <p className="text-sm text-ink-300">Nenhuma planilha carregada — os KPIs abaixo são os do modelo interativo.</p>}
      {importado && <p className="text-sm text-ink-400">Arquivo carregado: <span className="text-ink-200">{importado.nomeArquivo}</span></p>}
      {carregando && <p className="text-sm text-ink-400">Lendo planilha…</p>}
      {erro && <p className="text-sm text-blue-300">{erro}</p>}
    </Card>
  );
}
