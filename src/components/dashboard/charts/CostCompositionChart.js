"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { usePremissas } from "@/hooks/usePremissas";
import { formatBRL } from "@/lib/format";
import Card from "@/components/ui/Card";
import { CUSTO_COR, GRID_COR, axisSx, legendSx, tooltipSx } from "@/lib/chartTheme";

export default function CostCompositionChart() {
  const { series } = usePremissas();

  const dados = useMemo(
    () =>
      series.t1.map((anoDado) => ({
        ano: anoDado.ano,
        Variáveis: anoDado.custos.variaveis,
        Folha: anoDado.custos.folha,
        Fixos: anoDado.custos.fixos,
        Treinamento: anoDado.custos.treinamento,
      })),
    [series]
  );

  return (
    <Card title="Composição de custos" subtitle="Variáveis, folha, fixos e treinamento ao longo dos anos">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={dados} margin={{ top: 4, right: 12, left: 4, bottom: 0 }}>
          <CartesianGrid stroke={GRID_COR} vertical={false} />
          <XAxis dataKey="ano" {...axisSx} />
          <YAxis {...axisSx} tickFormatter={(v) => formatBRL(v)} width={80} />
          <Tooltip {...tooltipSx} formatter={(v) => formatBRL(v)} />
          <Legend {...legendSx} />
          <Bar dataKey="Variáveis" stackId="custos" fill={CUSTO_COR[0]} maxBarSize={24} />
          <Bar dataKey="Folha" stackId="custos" fill={CUSTO_COR[1]} maxBarSize={24} />
          <Bar dataKey="Fixos" stackId="custos" fill={CUSTO_COR[2]} maxBarSize={24} />
          <Bar dataKey="Treinamento" stackId="custos" fill={CUSTO_COR[3]} maxBarSize={24} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
