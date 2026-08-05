"use client";

import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { usePremissas } from "@/hooks/usePremissas";
import Card from "@/components/ui/Card";
import { GRID_COR, axisSx, tooltipSx } from "@/lib/chartTheme";

export default function WashTimeChart() {
  const { premissas } = usePremissas();
  const dados = premissas.tempoLavagem.historicoPorFuncionario.map((f) => ({
    nome: f.nome,
    minutos: f.min,
    status: f.status,
  }));
  const meta = premissas.tempoLavagem.tempoAlvoT0.valor;
  const media = premissas.tempoLavagem.mediaAtualEquipeAtiva.valor;

  return (
    <Card title="Tempo de lavagem por funcionário" subtitle="Hoje vs. meta de 30 min (referência: média atual de 79,5 min)">
      <ResponsiveContainer width="100%" height={300} minWidth={280}>
        <BarChart data={dados} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID_COR} vertical={false} />
          <XAxis
            dataKey="nome"
            {...axisSx}
            tick={{ fill: axisSx.tick.fill, fontSize: 10 }}
            interval={0}
            angle={-60}
            textAnchor="end"
            height={62}
          />
          <YAxis {...axisSx} width={36} unit=" min" />
          <Tooltip {...tooltipSx} formatter={(v, n, p) => [`${v} min`, p.payload.status]} />
          <ReferenceLine y={media} stroke="#6b6560" strokeDasharray="4 4" label={{ value: "média atual 79,5 min", fill: "#9a9a9a", fontSize: 10, position: "insideTopLeft" }} />
          <ReferenceLine y={meta} stroke="#4aa2ee" strokeDasharray="4 4" label={{ value: `meta ${meta} min`, fill: "#4aa2ee", fontSize: 10, position: "insideBottomLeft" }} />
          <Bar dataKey="minutos" fill="#1663c2" maxBarSize={24} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
