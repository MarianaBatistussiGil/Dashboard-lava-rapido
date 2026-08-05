"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { autenticar, validarCredenciais, CREDENCIAIS } from "@/lib/auth";

export default function LoginCard() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (validarCredenciais(usuario, senha)) {
      setErro("");
      autenticar();
      router.push("/dashboard");
    } else {
      setErro("Usuário ou senha incorretos.");
    }
  }

  function handleDemo() {
    autenticar();
    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-ink-700 bg-ink-900/80 p-8 shadow-[0_0_0_1px_rgba(0,0,0,0.4),0_24px_60px_-24px_rgba(0,0,0,0.8)] backdrop-blur-sm">
        <h2 className="text-base font-medium text-white">Entrar</h2>
        <p className="mt-1 text-[13px] text-ink-300">Acesse o dashboard de valuation</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-ink-300" htmlFor="usuario">
              Usuário
            </label>
            <input
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="username"
              className="mt-1.5 w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-ink-300" htmlFor="senha">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              className="mt-1.5 w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {erro && <p className="text-[13px] text-blue-300">{erro}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 active:bg-blue-700"
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={handleDemo}
            className="w-full rounded-lg border border-ink-600 px-4 py-2.5 text-sm font-medium text-ink-300 transition hover:border-ink-500 hover:text-white"
          >
            Entrar em modo demo
          </button>
        </form>

        <div className="mt-6 rounded-lg border border-ink-700 bg-black/40 px-3.5 py-2.5 text-[12px] text-ink-300">
          usuário: <span className="font-medium text-ink-200">{CREDENCIAIS.usuario}</span>{" "}
          <span className="text-ink-700">·</span> senha:{" "}
          <span className="font-medium text-ink-200">{CREDENCIAIS.senha}</span>
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] text-ink-400">
        Login apenas ilustrativo, sem autenticação real.
      </p>
    </div>
  );
}
