"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logoNogueira from "@/app/assets/image.png";
import { estaAutenticado, sair } from "@/lib/auth";
import { PremissasProvider } from "@/contexts/PremissasContext";
import SliderPanel from "@/components/dashboard/SliderPanel";
import KpiRow from "@/components/dashboard/KpiRow";
import ScenarioLegend from "@/components/dashboard/ScenarioLegend";
import RevenueEbitdaChart from "@/components/dashboard/charts/RevenueEbitdaChart";
import RevenueByServiceChart from "@/components/dashboard/charts/RevenueByServiceChart";
import SubscriptionVsOneOffChart from "@/components/dashboard/charts/SubscriptionVsOneOffChart";
import CapacityUtilizationChart from "@/components/dashboard/charts/CapacityUtilizationChart";
import WashTimeChart from "@/components/dashboard/charts/WashTimeChart";
import CostCompositionChart from "@/components/dashboard/charts/CostCompositionChart";
import FcffChart from "@/components/dashboard/charts/FcffChart";
import EquityBridgeChart from "@/components/dashboard/charts/EquityBridgeChart";
import SensitivityTable from "@/components/dashboard/charts/SensitivityTable";
import CashAccumulationChart from "@/components/dashboard/charts/CashAccumulationChart";
import PlanilhaImportCard from "@/components/dashboard/PlanilhaImportCard";

export default function DashboardPage() {
  const router = useRouter();
  const [pronto, setPronto] = useState(false);
  const [premissasAbertas, setPremissasAbertas] = useState(false);

  useEffect(() => {
    if (!estaAutenticado()) {
      router.replace("/");
      return;
    }
    setPronto(true);
  }, [router]);

  // Trava o scroll da página por trás enquanto o drawer de premissas está aberto
  // (mobile/tablet only — em telas lg+ o painel já é uma sidebar fixa, sem drawer).
  useEffect(() => {
    if (!premissasAbertas) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [premissasAbertas]);

  function handleSair() {
    sair();
    router.replace("/");
  }

  if (!pronto) return null;

  return (
    <PremissasProvider>
      <main className="min-h-screen bg-ink-950">
        <header className="flex items-center justify-between gap-3 border-b border-ink-800 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <span className="inline-flex shrink-0 rounded-md bg-white p-1">
              <Image src={logoNogueira} alt="Lava-Rápido Nogueira" className="h-6 w-auto" priority />
            </span>
            <p className="truncate text-[11px] font-medium uppercase tracking-[0.15em] text-ink-400 sm:text-xs sm:tracking-[0.2em]">
              <span className="sm:hidden">Nogueira</span>
              <span className="hidden sm:inline">Nogueira · Valuation Suite</span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            <div className="hidden md:block">
              <ScenarioLegend />
            </div>
            <button
              onClick={() => setPremissasAbertas(true)}
              className="rounded-lg border border-ink-600 px-3 py-1.5 text-xs font-medium text-ink-300 transition hover:border-ink-500 hover:text-white lg:hidden"
            >
              Premissas
            </button>
            <button
              onClick={handleSair}
              className="rounded-lg border border-ink-600 px-3 py-1.5 text-xs font-medium text-ink-300 transition hover:border-ink-500 hover:text-white"
            >
              Sair
            </button>
          </div>
        </header>

        <div className="lg:flex lg:items-start">
          {/* Backdrop do drawer — só existe (e captura clique) enquanto aberto, só abaixo de lg */}
          {premissasAbertas && (
            <div
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setPremissasAbertas(false)}
              aria-hidden
            />
          )}

          <aside
            className={`fixed inset-y-0 left-0 z-50 h-dvh w-[86%] max-w-[320px] overflow-y-auto border-r border-ink-800 bg-ink-950 shadow-2xl transition-transform duration-300 ease-out
              lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-80 lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:shadow-none
              ${premissasAbertas ? "translate-x-0" : "-translate-x-full"}`}
          >
            <SliderPanel onClose={() => setPremissasAbertas(false)} />
          </aside>

          <div className="min-w-0 flex-1 space-y-4 p-4 sm:space-y-5 sm:p-6">
            <PlanilhaImportCard />

            <KpiRow />

            <div className="grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-2">
              <div className="xl:col-span-2">
                <RevenueEbitdaChart />
              </div>
              <RevenueByServiceChart />
              <SubscriptionVsOneOffChart />
              <div className="xl:col-span-2">
                <CapacityUtilizationChart />
              </div>
              <WashTimeChart />
              <CostCompositionChart />
              <FcffChart />
              <EquityBridgeChart />
              <div className="xl:col-span-2">
                <SensitivityTable />
              </div>
              <div className="xl:col-span-2">
                <CashAccumulationChart />
              </div>
            </div>
          </div>
        </div>
      </main>
    </PremissasProvider>
  );
}
