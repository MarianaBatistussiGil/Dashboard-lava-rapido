"use client";

import { useMemo } from "react";
import { usePremissas } from "@/hooks/usePremissas";
import { formatBRL, formatPercent } from "@/lib/format";
import Card from "@/components/ui/Card";
import { corSequencial } from "@/lib/chartTheme";

export default function SensitivityTable() {
  const { sensibilidade } = usePremissas();

  const { waccs, gs, matriz, min, max } = useMemo(() => {
    const waccs = [...new Set(sensibilidade.map((c) => c.wacc))].sort((a, b) => a - b);
    const gs = [...new Set(sensibilidade.map((c) => c.g))].sort((a, b) => a - b);
    const matriz = waccs.map((wacc) => gs.map((g) => sensibilidade.find((c) => c.wacc === wacc && c.g === g)?.equityValue ?? 0));
    const valores = matriz.flat();
    return { waccs, gs, matriz, min: Math.min(...valores), max: Math.max(...valores) };
  }, [sensibilidade]);

  return (
    <Card title="Sensibilidade — Equity Value" subtitle="Matriz WACC × crescimento na perpetuidade (g), cenário T1">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr>
              <th className="p-2 text-left text-[11px] font-medium uppercase tracking-wider text-ink-500">WACC \ g</th>
              {gs.map((g) => (
                <th key={g} className="p-2 text-right text-[11px] font-medium text-ink-400">
                  {formatPercent(g)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {waccs.map((wacc, i) => (
              <tr key={wacc}>
                <td className="p-2 text-[11px] font-medium text-ink-400">{formatPercent(wacc)}</td>
                {matriz[i].map((valor, j) => {
                  const t = max > min ? (valor - min) / (max - min) : 0.5;
                  return (
                    <td
                      key={j}
                      className="whitespace-nowrap p-2 text-right font-medium"
                      style={{ background: corSequencial(t), color: t > 0.55 ? "#fbeaee" : "#1a050c" }}
                    >
                      {formatBRL(valor)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
