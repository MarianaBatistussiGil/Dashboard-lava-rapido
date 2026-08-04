"use client";

import { usePremissas } from "@/hooks/usePremissas";
import { formatBRL, formatPercent } from "@/lib/format";
import KpiCard from "./KpiCard";

export default function KpiRow() {
  const { series, valuation, decisao, payback } = usePremissas();

  const ultimoT1 = series.t1[series.t1.length - 1];
  const ultimoAsIs = series.asIs[series.asIs.length - 1];

  const deltaEbitda = ultimoT1.ebitda - ultimoAsIs.ebitda;
  const deltaReceitaPerdida = ultimoAsIs.receitaPerdida - ultimoT1.receitaPerdida;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-7">
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
