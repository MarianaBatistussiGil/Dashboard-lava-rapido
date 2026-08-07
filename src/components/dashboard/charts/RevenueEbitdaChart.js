"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { usePremissas } from "@/hooks/usePremissas";
import { formatBRL } from "@/lib/format";
import Card from "@/components/ui/Card";
import { CENARIO_COR, GRID_COR, axisSx, legendSx, tooltipSx } from "@/lib/chartTheme";

export default function RevenueEbitdaChart() {
  const { series, anoAtivacaoMaquina } = usePremissas();

  const dados = useMemo(
    () =>
      series.t1.map((anoDado) => ({
        ano: anoDado.ano,
        receita: anoDado.receita.total,
        ebitda: anoDado.ebitda,
      })),
    [series]
  );

  return (
    <Card title="Receita e EBITDA por ano" subtitle="Linha sólida = receita · linha tracejada = EBITDA">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={dados} margin={{ top: 4, right: 12, left: 4, bottom: 0 }}>
          <CartesianGrid stroke={GRID_COR} vertical={false} />
          <XAxis dataKey="ano" {...axisSx} />
          <YAxis {...axisSx} tickFormatter={(v) => formatBRL(v)} width={80} />
          <Tooltip {...tooltipSx} formatter={(v) => formatBRL(v)} />
          <Legend {...legendSx} />
          {anoAtivacaoMaquina != null && (
            <ReferenceLine x={anoAtivacaoMaquina} stroke="#3a3a3a" strokeDasharray="3 3" label={{ value: "Máquina", fill: "#6b6560", fontSize: 10, position: "top" }} />
          )}

          <Line type="monotone" dataKey="receita" name="Receita" stroke={CENARIO_COR.t1} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="ebitda" name="EBITDA" stroke={CENARIO_COR.t1} strokeWidth={2} strokeDasharray="5 4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
