"use client";

import { usePremissas } from "@/hooks/usePremissas";
import { formatBRL, formatPercent, formatMultiplo } from "@/lib/format";
import { METRICAS } from "@/lib/planilhaImport";
import KpiCard from "./KpiCard";

const FORMATADORES = {
  moeda: formatBRL,
  percentual: formatPercent,
  multiplo: formatMultiplo,
};

// Quando há uma planilha importada, os KPIs mostram só o que veio dela — nada
// calculado pelo motor de premissas entra nessa linha, pra não misturar as duas
// fontes de número.
function KpiRowImportado({ importado }) {
  return (
    <div>
      <p className="mb-2 text-[11px] text-ink-500">
        Mostrando dados importados de <span className="text-ink-300">"{importado.nomeArquivo}"</span> — os sliders
        continuam ativos, mas não alimentam esses cards enquanto uma planilha estiver carregada.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:[grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]">
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

export default function KpiRow({ importado }) {
  const { series, valuation, decisao, payback } = usePremissas();

  if (importado) return <KpiRowImportado importado={importado} />;

  const ultimoT1 = series.t1[series.t1.length - 1];
  const ultimoAsIs = series.asIs[series.asIs.length - 1];

  const deltaEbitda = ultimoT1.ebitda - ultimoAsIs.ebitda;
  const deltaReceitaPerdida = ultimoAsIs.receitaPerdida - ultimoT1.receitaPerdida;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:[grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]">
      <KpiCard label="Enterprise Value" value={formatBRL(valuation.ev.enterpriseValue)} delta={formatBRL(valuation.ev.enterpriseValue - valuation.evAsIs.enterpriseValue)} />
      <KpiCard label="Equity Value" value={formatBRL(valuation.eq)} delta={formatBRL(valuation.eq - valuation.eqAsIs)} />
      <KpiCard label="VPL do plano" value={formatBRL(decisao.total.vpl)} />
      <KpiCard label="TIR do plano" value={decisao.total.tir != null ? formatPercent(decisao.total.tir) : "n/d"} />
      <KpiCard label="EBITDA (último ano)" value={formatBRL(ultimoT1.ebitda)} delta={formatBRL(deltaEbitda)} />
      <KpiCard label="Payback da máquina" value={payback != null ? `${payback.toFixed(1)} anos` : "> horizonte"} />
      <KpiCard label="Receita perdida (último ano)" value={formatBRL(ultimoT1.receitaPerdida)} delta={formatBRL(deltaReceitaPerdida)} deltaLabel="recuperado vs. As-Is" />
    </div>
  );
}
