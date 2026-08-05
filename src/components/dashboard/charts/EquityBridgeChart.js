"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { usePremissas } from "@/hooks/usePremissas";
import { formatBRL } from "@/lib/format";
import Card from "@/components/ui/Card";
import { GRID_COR, axisSx, tooltipSx } from "@/lib/chartTheme";

const COR = { entrada: "#4aa2ee", saida: "#072452", subtotal: "#f2f0f1" };

export default function EquityBridgeChart() {
  const { valuation, valores } = usePremissas();

  const dados = useMemo(() => {
    const somaFcff = valuation.ev.enterpriseValue - valuation.ev.valorTerminalDescontado;
    const vt = valuation.ev.valorTerminalDescontado;
    const ev = valuation.ev.enterpriseValue;
    const divida = valores.financeiro.dividaLiquidaAtual;
    const eq = valuation.eq;

    return [
      { nome: "FCFF descontados", base: 0, valor: somaFcff, tipo: "entrada", real: somaFcff },
      { nome: "Valor terminal", base: somaFcff, valor: vt, tipo: "entrada", real: vt },
      { nome: "Enterprise Value", base: 0, valor: ev, tipo: "subtotal", real: ev },
      { nome: "Dívida líquida", base: eq, valor: divida, tipo: "saida", real: -divida },
      { nome: "Equity Value", base: 0, valor: eq, tipo: "subtotal", real: eq },
    ];
  }, [valuation, valores.financeiro.dividaLiquidaAtual]);

  return (
    <Card title="Ponte Enterprise Value → Equity Value">
      <ResponsiveContainer width="100%" height={300} minWidth={260}>
        <BarChart data={dados} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID_COR} vertical={false} />
          <XAxis
            dataKey="nome"
            {...axisSx}
            tick={{ fill: axisSx.tick.fill, fontSize: 10 }}
            interval={0}
            angle={-40}
            textAnchor="end"
            height={70}
          />
          <YAxis {...axisSx} tickFormatter={(v) => formatBRL(v)} width={72} />
          <Tooltip {...tooltipSx} formatter={(_, __, p) => [formatBRL(p.payload.real), p.payload.nome]} />
          <Bar dataKey="base" stackId="ponte" fill="transparent" />
          <Bar dataKey="valor" stackId="ponte" radius={[4, 4, 0, 0]} maxBarSize={56}>
            {dados.map((d) => (
              <Cell key={d.nome} fill={COR[d.tipo]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 flex gap-4 text-[11px] text-ink-300">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: COR.entrada }} /> soma
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: COR.saida }} /> subtrai
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: COR.subtotal }} /> subtotal
        </span>
      </div>
    </Card>
  );
}
