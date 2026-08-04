export default function KpiCard({ label, value, delta, deltaLabel }) {
  const positivo = delta != null && delta >= 0;
  return (
    <div className="min-w-0 rounded-2xl border border-ink-800 bg-ink-900/60 p-3.5 sm:p-5">
      <p className="text-[10px] font-medium uppercase leading-snug tracking-wider text-ink-500 sm:text-[11px]">{label}</p>
      <p className="mt-1.5 break-words text-lg font-semibold leading-tight tracking-tight text-white sm:mt-2 sm:text-2xl">
        {value}
      </p>
      {delta != null && (
        <p className={`mt-1 leading-snug sm:mt-1.5 text-[11px] font-medium sm:text-[12px] ${positivo ? "text-ink-300" : "text-wine-400"}`}>
          {positivo ? "↑" : "↓"} {delta} <span className="text-ink-600">{deltaLabel ?? "vs. As-Is"}</span>
        </p>
      )}
    </div>
  );
}
