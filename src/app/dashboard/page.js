"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { estaAutenticado, sair } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [pronto, setPronto] = useState(false);

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
    <main className="min-h-screen bg-ink-950 p-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-500">Dashboard chega completo na Etapa 3.</p>
        <button
          onClick={handleSair}
          className="rounded-lg border border-ink-600 px-3 py-1.5 text-xs font-medium text-ink-300 transition hover:border-ink-500 hover:text-white"
        >
          Sair
        </button>
      </div>
    </main>
  );
}
