"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { usePremissas } from "@/hooks/usePremissas";
import { formatBRL } from "@/lib/format";
import Card from "@/components/ui/Card";
import { GRID_COR, axisSx, legendSx, tooltipSx } from "@/lib/chartTheme";

export default function SubscriptionVsOneOffChart() {
  const { series } = usePremissas();

  const dados = useMemo(
    () =>
      series.t1.map((anoDado) => ({
        ano: anoDado.ano,
        Avulso: anoDado.receita.total - anoDado.receita.assinatura.total,
        Assinatura: anoDado.receita.assinatura.total,
      })),
    [series]
  );

  return (
    <Card title="Receita avulsa vs. assinatura" subtitle="A previsibilidade que justifica a capacidade instalada">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={dados} margin={{ top: 4, right: 12, left: 4, bottom: 0 }}>
          <CartesianGrid stroke={GRID_COR} vertical={false} />
          <XAxis dataKey="ano" {...axisSx} />
          <YAxis {...axisSx} tickFormatter={(v) => formatBRL(v)} width={80} />
          <Tooltip {...tooltipSx} formatter={(v) => formatBRL(v)} />
          <Legend {...legendSx} />
          <Bar dataKey="Avulso" stackId="receita" fill="#af3f57" maxBarSize={24} />
          <Bar dataKey="Assinatura" stackId="receita" fill="#e8748c" maxBarSize={24} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
