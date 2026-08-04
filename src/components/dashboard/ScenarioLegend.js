import { CENARIO_COR, CENARIO_NOME } from "@/lib/chartTheme";

export default function ScenarioLegend() {
  return (
    <div className="flex items-center gap-4 text-[11px] text-ink-400">
      {Object.keys(CENARIO_NOME).map((cenario) => (
        <span key={cenario} className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: CENARIO_COR[cenario] }} />
          {CENARIO_NOME[cenario]}
        </span>
      ))}
    </div>
  );
}
