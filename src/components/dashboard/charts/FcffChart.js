"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { usePremissas } from "@/hooks/usePremissas";
import { formatBRL } from "@/lib/format";
import Card from "@/components/ui/Card";
import { GRID_COR, axisSx, tooltipSx } from "@/lib/chartTheme";

export default function FcffChart() {
  const { series, valuation } = usePremissas();

  const dados = useMemo(() => series.t1.map((a) => ({ ano: a.ano, fcff: a.fcff })), [series]);

  return (
    <Card title="FCFF por ano (T1)" subtitle="Fluxo de caixa livre para a firma, valor terminal destacado à parte">
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={dados} margin={{ top: 4, right: 12, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="fcffFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8748c" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#e8748c" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={GRID_COR} vertical={false} />
          <XAxis dataKey="ano" {...axisSx} />
          <YAxis {...axisSx} tickFormatter={(v) => formatBRL(v)} width={80} />
          <Tooltip {...tooltipSx} formatter={(v) => formatBRL(v)} />
          <Area type="monotone" dataKey="fcff" stroke="#e8748c" strokeWidth={2} fill="url(#fcffFill)" />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-4 flex items-center justify-between rounded-lg border border-ink-800 bg-black/30 px-4 py-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-ink-300">Valor terminal (descontado)</p>
          <p className="mt-0.5 text-sm font-medium text-white">{formatBRL(valuation.ev.valorTerminalDescontado)}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-wider text-ink-300">Soma FCFF descontados</p>
          <p className="mt-0.5 text-sm font-medium text-white">
            {formatBRL(valuation.ev.enterpriseValue - valuation.ev.valorTerminalDescontado)}
          </p>
        </div>
      </div>
    </Card>
  );
}
