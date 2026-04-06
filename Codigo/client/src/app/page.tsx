"use client";

import { contratoService } from "@/services/contrato.service";
import { microsservicoService } from "@/services/microsservico.service";
import { rentalsService } from "@/services/rentals.service";
import { reservasService } from "@/services/reservas.service";
import { vehiclesService } from "@/services/vehicles.service";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [statusA, setStatusA] = useState<string | null>(null);
  const [statusVehicles, setStatusVehicles] = useState<string | null>(null);
  const [statusRentals, setStatusRentals] = useState<string | null>(null);
  const [statusContrato, setStatusContrato] = useState<string | null>(null);
  const [statusReservas, setStatusReservas] = useState<string | null>(null);
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

  const testVehiclesService = async () => {
    setLoading(true);
    try {
      const res = await vehiclesService.ping();
      setStatusVehicles(`Sucesso: ${res}`);
    } catch (error: any) {
      setStatusVehicles(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testRentalsService = async () => {
    setLoading(true);
    try {
      const res = await rentalsService.ping();
      setStatusRentals(`Sucesso: ${res}`);
    } catch (error: any) {
      setStatusRentals(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testContratoService = async () => {
    setLoading(true);
    try {
      const res = await contratoService.ping();
      setStatusContrato(`Sucesso: ${res}`);
    } catch (error: any) {
      setStatusContrato(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testReservasService = async () => {
    setLoading(true);
    try {
      const res = await reservasService.ping();
      setStatusReservas(`Sucesso: ${res}`);
    } catch (error: any) {
      setStatusReservas(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black p-8">
      <main className="flex flex-col items-center max-w-3xl w-full bg-white dark:bg-zinc-900 rounded-3xl p-12 shadow-2xl dark:shadow-none border border-zinc-100 dark:border-zinc-800">
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

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Card usersService */}
          <div className="flex flex-col p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
            <h2 className="font-semibold text-zinc-800 dark:text-zinc-300 mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              usersService
            </h2>
            <p className="text-xs text-zinc-400 mb-4">Porta 8080</p>
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

          {/* Card vehiclesService */}
          <div className="flex flex-col p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
            <h2 className="font-semibold text-zinc-800 dark:text-zinc-300 mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              vehiclesService
            </h2>
            <p className="text-xs text-zinc-400 mb-4">Porta 8081</p>
            <button
              onClick={testVehiclesService}
              disabled={loading}
              className="w-full py-3 px-4 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              Testar Conexão
            </button>
            {statusVehicles && (
              <p className={`mt-4 text-xs font-mono break-all p-3 rounded-lg ${statusVehicles.startsWith('Erro') ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20'}`}>
                {statusVehicles}
              </p>
            )}
          </div>

          {/* Card rentalsService */}
          <div className="flex flex-col p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
            <h2 className="font-semibold text-zinc-800 dark:text-zinc-300 mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              rentalsService
            </h2>
            <p className="text-xs text-zinc-400 mb-4">Porta 8082</p>
            <button
              onClick={testRentalsService}
              disabled={loading}
              className="w-full py-3 px-4 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              Testar Conexão
            </button>
            {statusRentals && (
              <p className={`mt-4 text-xs font-mono break-all p-3 rounded-lg ${statusRentals.startsWith('Erro') ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20'}`}>
                {statusRentals}
              </p>
            )}
          </div>

          {/* Card contratoService */}
          <div className="flex flex-col p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
            <h2 className="font-semibold text-zinc-800 dark:text-zinc-300 mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              contratoService
            </h2>
            <p className="text-xs text-zinc-400 mb-4">Porta 8083</p>
            <button
              onClick={testContratoService}
              disabled={loading}
              className="w-full py-3 px-4 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              Testar Conexão
            </button>
            {statusContrato && (
              <p className={`mt-4 text-xs font-mono break-all p-3 rounded-lg ${statusContrato.startsWith('Erro') ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20'}`}>
                {statusContrato}
              </p>
            )}
          </div>

          {/* Card reservasService */}
          <div className="flex flex-col p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
            <h2 className="font-semibold text-zinc-800 dark:text-zinc-300 mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              reservasService
            </h2>
            <p className="text-xs text-zinc-400 mb-4">Porta 8084</p>
            <button
              onClick={testReservasService}
              disabled={loading}
              className="w-full py-3 px-4 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              Testar Conexão
            </button>
            {statusReservas && (
              <p className={`mt-4 text-xs font-mono break-all p-3 rounded-lg ${statusReservas.startsWith('Erro') ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20'}`}>
                {statusReservas}
              </p>
            )}
          </div>
        </section>

        <footer className="mt-12 text-zinc-400 text-sm text-center">
          O Gateway porta 8000 redireciona automaticamente para as portas internas usando DNS do Docker.
        </footer>
      </main>
    </div>
  );
}
