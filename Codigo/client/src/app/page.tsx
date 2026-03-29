"use client";

import Image from "next/image";
import { useState } from "react";
import { microsservicoService } from "@/services/microsservico.service";
import { microsservicoBService } from "@/services/microsservico-b.service";

export default function Home() {
  const [statusA, setStatusA] = useState<string | null>(null);
  const [statusB, setStatusB] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testServiceA = async () => {
    setLoading(true);
    try {
      const res = await microsservicoService.ping();
      setStatusA(`Sucesso: ${res}`);
    } catch (error: any) {
      setStatusA(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testServiceB = async () => {
    setLoading(true);
    try {
      const res = await microsservicoBService.ping();
      setStatusB(`Sucesso: ${res}`);
    } catch (error: any) {
      setStatusB(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black p-8">
      <main className="flex flex-col items-center max-w-2xl w-full bg-white dark:bg-zinc-900 rounded-3xl p-12 shadow-2xl dark:shadow-none border border-zinc-100 dark:border-zinc-800">
        <header className="mb-12 flex flex-col items-center">
          <Image
            className="dark:invert mb-6"
            src="/next.svg"
            alt="Next.js logo"
            width={120}
            height={24}
            priority
          />
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 text-center tracking-tight">
            Painel de Teste - API Gateway
          </h1>
          <p className="mt-2 text-zinc-500 text-center">
            Ponto Central: <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-sm font-mono text-zinc-800 dark:text-zinc-300">http://localhost:8000</code>
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {/* Card Microserviço A */}
          <div className="flex flex-col p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
            <h2 className="font-semibold text-zinc-800 dark:text-zinc-300 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Microserviço A
            </h2>
            <button
              onClick={testServiceA}
              disabled={loading}
              className="w-full py-3 px-4 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              Testar Conexão
            </button>
            {statusA && (
              <p className={`mt-4 text-xs font-mono break-all p-3 rounded-lg ${statusA.startsWith('Erro') ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20'}`}>
                {statusA}
              </p>
            )}
          </div>

          {/* Card Microserviço B */}
          <div className="flex flex-col p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
            <h2 className="font-semibold text-zinc-800 dark:text-zinc-300 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Microserviço B
            </h2>
            <button
              onClick={testServiceB}
              disabled={loading}
              className="w-full py-3 px-4 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              Testar Conexão
            </button>
            {statusB && (
              <p className={`mt-4 text-xs font-mono break-all p-3 rounded-lg ${statusB.startsWith('Erro') ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20'}`}>
                {statusB}
              </p>
            )}
          </div>
        </section>

        <footer className="mt-12 text-zinc-400 text-sm text-center">
          O Gateway porta 8000 redireciona automaticamente para as portas 8080 e 8081 usando DNS do Docker.
        </footer>
      </main>
    </div>
  );
}
