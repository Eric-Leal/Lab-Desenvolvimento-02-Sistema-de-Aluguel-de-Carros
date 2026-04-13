"use client"

import Link from "next/link"
import { useDevSession } from "@/store/use-dev-session"
import { SolicitarAluguelForm } from "@/components/veiculos/SolicitarAluguelForm"
import type { Automovel } from "@/types/vehicle"

interface SolicitarAluguelClientProps {
  vehicle: Automovel
}

export function SolicitarAluguelClient({ vehicle }: SolicitarAluguelClientProps) {
  const { currentClient } = useDevSession()

  if (!currentClient) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-surface py-20 text-center">
        <div className="rounded-full bg-amber-100 p-4 dark:bg-amber-950/40">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-amber-600 dark:text-amber-400"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div className="space-y-1">
          <p className="text-base font-semibold text-text-primary">Nenhum cliente selecionado</p>
          <p className="ds-body text-text-secondary max-w-sm">
            Use a barra de desenvolvimento no topo da página para selecionar um cliente e testar o fluxo de solicitação.
          </p>
        </div>
        <Link
          href={`/veiculos/${vehicle.matricula}`}
          className="mt-2 rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-text-primary transition hover:bg-surface-2"
        >
          Voltar ao veículo
        </Link>
      </div>
    )
  }

  return <SolicitarAluguelForm vehicle={vehicle} currentClient={currentClient} />
}
