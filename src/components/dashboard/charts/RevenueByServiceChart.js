"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { usePremissas } from "@/hooks/usePremissas";
import { formatBRL } from "@/lib/format";
import Card from "@/components/ui/Card";
import { GRID_COR, SERVICO_COR, axisSx, legendSx, tooltipSx } from "@/lib/chartTheme";

export default function RevenueByServiceChart() {
  const { series, premissas } = usePremissas();

  const nomes = premissas.servicos.map((s) => s.nome);

  const dados = useMemo(
    () =>
      series.t1.map((anoDado) => {
        const linha = { ano: anoDado.ano };
        anoDado.receita.porServico.forEach((s) => {
          linha[s.nome] = s.receita;
        });
        return linha;
      }),
    [series]
  );

  return (
    <Card title="Receita por serviço (T0/T1)" subtitle="O portfólio deslocando a dependência da lavagem completa">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={dados} margin={{ top: 4, right: 12, left: 4, bottom: 0 }}>
          <CartesianGrid stroke={GRID_COR} vertical={false} />
          <XAxis dataKey="ano" {...axisSx} />
          <YAxis {...axisSx} tickFormatter={(v) => formatBRL(v)} width={80} />
          <Tooltip {...tooltipSx} formatter={(v) => formatBRL(v)} />
          <Legend {...legendSx} />
          {nomes.map((nome, i) => (
            <Bar key={nome} dataKey={nome} stackId="servicos" fill={SERVICO_COR[i % SERVICO_COR.length]} maxBarSize={24} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
