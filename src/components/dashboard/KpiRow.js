"use client";

import { formatBRL, formatPercent, formatMultiplo } from "@/lib/format";
import { METRICAS } from "@/lib/planilhaImport";
import Card from "@/components/ui/Card";
import KpiCard from "./KpiCard";

const FORMATADORES = {
  moeda: formatBRL,
  percentual: formatPercent,
  multiplo: formatMultiplo,
};

export default function KpiRow({ importado }) {
  if (!importado) {
    return (
      <Card>
        <p className="text-sm text-ink-300">
          Nenhuma planilha carregada ainda — escolha um arquivo .xlsx acima para ver os KPIs aqui.
        </p>
      </Card>
    );
  }

  return (
    <div>
      <p className="mb-2 text-[11px] text-ink-300">
        Dados de <span className="text-ink-200">"{importado.nomeArquivo}"</span>
      </p>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {METRICAS.map((m) => {
          const achado = importado.resultado[m.chave];
          const formatar = FORMATADORES[m.tipo];
          return (
            <KpiCard
              key={m.chave}
              label={m.nome}
              value={achado ? formatar(achado.valor) : "não encontrado"}
              nota={achado?.local}
            />
          );
        })}
      </div>
    </div>
  );
}
