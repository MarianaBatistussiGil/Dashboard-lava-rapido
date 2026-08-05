"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { usePremissas } from "@/hooks/usePremissas";
import { ocupacaoCapacidade } from "@/lib/dcf";
import { formatBRL, formatPercent } from "@/lib/format";
import Card from "@/components/ui/Card";
import { CENARIO_COR, GRID_COR, axisSx, legendSx, tooltipSx } from "@/lib/chartTheme";

export default function CapacityUtilizationChart() {
  const { series } = usePremissas();

  const ocupacao = useMemo(
    () =>
      series.t1.map((_, i) => ({
        ano: series.t1[i].ano,
        "As-Is": ocupacaoCapacidade(series.asIs[i]),
        T0: ocupacaoCapacidade(series.t0[i]),
        T1: ocupacaoCapacidade(series.t1[i]),
      })),
    [series]
  );

  const perdida = useMemo(
    () =>
      series.t1.map((_, i) => ({
        ano: series.t1[i].ano,
        "As-Is": series.asIs[i].receitaPerdida,
        T0: series.t0[i].receitaPerdida,
        T1: series.t1[i].receitaPerdida,
      })),
    [series]
  );

  return (
    <Card title="Ocupação da capacidade e receita perdida" subtitle="A prova visual do ganho da padronização de tempo e da máquina">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <p className="mb-1 text-[11px] uppercase tracking-wider text-ink-300">Ocupação da capacidade</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ocupacao} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={GRID_COR} vertical={false} />
              <XAxis dataKey="ano" {...axisSx} />
              <YAxis {...axisSx} tickFormatter={(v) => formatPercent(v)} width={54} />
              <Tooltip {...tooltipSx} formatter={(v) => formatPercent(v)} />
              <Legend {...legendSx} />
              <Bar dataKey="As-Is" fill={CENARIO_COR.asIs} maxBarSize={10} radius={[3, 3, 0, 0]} />
              <Bar dataKey="T0" fill={CENARIO_COR.t0} maxBarSize={10} radius={[3, 3, 0, 0]} />
              <Bar dataKey="T1" fill={CENARIO_COR.t1} maxBarSize={10} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="mb-1 text-[11px] uppercase tracking-wider text-ink-300">Receita perdida</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={perdida} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={GRID_COR} vertical={false} />
              <XAxis dataKey="ano" {...axisSx} />
              <YAxis {...axisSx} tickFormatter={(v) => formatBRL(v)} width={70} />
              <Tooltip {...tooltipSx} formatter={(v) => formatBRL(v)} />
              <Legend {...legendSx} />
              <Line type="monotone" dataKey="As-Is" stroke={CENARIO_COR.asIs} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="T0" stroke={CENARIO_COR.t0} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="T1" stroke={CENARIO_COR.t1} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
