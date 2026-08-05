"use client";

import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { usePremissas } from "@/hooks/usePremissas";
import { caixaAcumulado } from "@/lib/dcf";
import { formatBRL } from "@/lib/format";
import Card from "@/components/ui/Card";
import { GRID_COR, axisSx, tooltipSx } from "@/lib/chartTheme";

export default function CashAccumulationChart() {
  const { series, valores, anoAtivacaoMaquina, payback } = usePremissas();

  const dados = useMemo(
    () => caixaAcumulado({ serie: series.t1, caixaInicial: valores.financeiro.caixaInicial }),
    [series, valores.financeiro.caixaInicial]
  );

  const paybackAno = payback != null && anoAtivacaoMaquina != null ? anoAtivacaoMaquina + payback : null;
  const paybackPonto = paybackAno != null ? dados.find((d) => d.ano >= Math.round(paybackAno)) : null;

  return (
    <Card title="Caixa acumulado" subtitle="Ponto de payback e cruzamento com o valor da máquina">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={dados} margin={{ top: 4, right: 12, left: 4, bottom: 0 }}>
          <CartesianGrid stroke={GRID_COR} vertical={false} />
          <XAxis dataKey="ano" {...axisSx} />
          <YAxis {...axisSx} tickFormatter={(v) => formatBRL(v)} width={80} />
          <Tooltip {...tooltipSx} formatter={(v) => formatBRL(v)} />
          <ReferenceLine y={valores.maquina.capex} stroke="#6b6560" strokeDasharray="4 4" label={{ value: "capex da máquina", fill: "#6b6560", fontSize: 10, position: "insideTopLeft" }} />
          {anoAtivacaoMaquina != null && (
            <ReferenceLine x={anoAtivacaoMaquina} stroke="#3a3a3a" strokeDasharray="3 3" label={{ value: "ativação", fill: "#6b6560", fontSize: 10, position: "top" }} />
          )}
          {paybackPonto && <ReferenceDot x={paybackPonto.ano} y={paybackPonto.caixa} r={5} fill="#4aa2ee" stroke="#0a0a0a" strokeWidth={2} label={{ value: "payback", fill: "#4aa2ee", fontSize: 10, position: "top" }} />}
          <Line type="monotone" dataKey="caixa" stroke="#4aa2ee" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
