export default function KpiCard({ label, value, delta, deltaLabel }) {
  const positivo = delta != null && delta >= 0;
  return (
    <div className="rounded-2xl border border-ink-800 bg-ink-900/60 p-5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-ink-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{value}</p>
      {delta != null && (
        <p className={`mt-1.5 text-[12px] font-medium ${positivo ? "text-ink-300" : "text-wine-400"}`}>
          {positivo ? "↑" : "↓"} {delta} <span className="text-ink-600">{deltaLabel ?? "vs. As-Is"}</span>
        </p>
      )}
    </div>
  );
}
