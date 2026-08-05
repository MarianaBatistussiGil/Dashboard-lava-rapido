import Image from "next/image";
import logoNogueira from "@/app/assets/image.png";

export default function Headline() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="inline-flex rounded-lg bg-white p-1.5 shadow-lg shadow-black/40">
          <Image src={logoNogueira} alt="Lava-Rápido Nogueira" className="h-9 w-auto" priority />
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.28em] text-ink-500">
          Valuation Suite
        </span>
      </div>

      <span className="mt-10 inline-flex items-center rounded-full border border-blue-800 bg-blue-950 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-blue-200">
        Modelo de DCF interativo
      </span>

      <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
        Valuation do
        <br />
        Lava-Rápido Nogueira
      </h1>

      <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-500">
        Um modelo de DCF vivo para o Lava-Rápido Nogueira. Ajuste WACC, crescimento e
        perpetuidade — e veja o Equity Value responder em tempo real, cenário a
        cenário, do balde ao Enterprise Value.
      </p>

      <p className="mt-16 text-[11px] font-medium uppercase tracking-[0.2em] text-ink-600">
        Base 2025 · Projeção 2026–2035
      </p>
    </div>
  );
}
