"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logoNogueira from "@/app/assets/image.png";
import { estaAutenticado, sair } from "@/lib/auth";
import PlanilhaImportCard from "@/components/dashboard/PlanilhaImportCard";
import KpiRow from "@/components/dashboard/KpiRow";

export default function DashboardPage() {
  const router = useRouter();
  const [pronto, setPronto] = useState(false);
  const [planilhaImportada, setPlanilhaImportada] = useState(null);

  useEffect(() => {
    if (!estaAutenticado()) {
      router.replace("/");
      return;
    }
    setPronto(true);
  }, [router]);

  function handleSair() {
    sair();
    router.replace("/");
  }

  if (!pronto) return null;

  return (
    <main className="min-h-screen bg-ink-950">
      <header className="flex items-center justify-between gap-3 border-b border-ink-800 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <Image src={logoNogueira} alt="Lava-Rápido Nogueira" className="h-11 w-auto shrink-0" priority />
          <p className="truncate text-[11px] font-medium uppercase tracking-[0.15em] text-ink-400 sm:text-xs sm:tracking-[0.2em]">
            <span className="sm:hidden">Nogueira</span>
            <span className="hidden sm:inline">Nogueira · Valuation Suite</span>
          </p>
        </div>
        <button
          onClick={handleSair}
          className="rounded-lg border border-ink-600 px-3 py-1.5 text-xs font-medium text-ink-300 transition hover:border-ink-500 hover:text-white"
        >
          Sair
        </button>
      </header>

      <div className="mx-auto max-w-3xl space-y-4 p-4 sm:space-y-5 sm:p-8">
        <PlanilhaImportCard
          importado={planilhaImportada}
          onImportar={(resultado, nomeArquivo) => setPlanilhaImportada({ resultado, nomeArquivo })}
          onLimpar={() => setPlanilhaImportada(null)}
        />

        <KpiRow importado={planilhaImportada} />
      </div>
    </main>
  );
}
