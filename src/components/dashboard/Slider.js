"use client";

export default function Slider({ label, value, min, max, step, unidade, format, onChange, disabled = false }) {
  const texto = format ? format(value) : `${Math.round(value * 100) / 100}${unidade ? ` ${unidade}` : ""}`;
  return (
    <div className={disabled ? "opacity-40" : ""}>
      <div className="flex items-center justify-between gap-2">
        <label className="text-[12px] text-ink-400">{label}</label>
        <span className="whitespace-nowrap text-[12px] font-medium text-white">{texto}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step ?? (max - min) / 100}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 h-1 w-full cursor-pointer appearance-none rounded-full bg-ink-700 accent-wine-500 disabled:cursor-not-allowed"
      />
    </div>
  );
}
