"use client"

import Link from "next/link"
import type { Automovel } from "@/types/vehicle"
import { useAuth } from "@/components/providers/auth-provider"

interface VehicleDetailInfoProps {
  vehicle: Automovel
}

const detailRows = (vehicle: Automovel) => [
  { label: "Matrícula", value: String(vehicle.matricula) },
  { label: "Placa", value: vehicle.placa },
  { label: "Ano", value: String(vehicle.ano) },
  { label: "Status", value: vehicle.disponivel ? "Disponível" : "Indisponível" },
]

export function VehicleDetailInfo({ vehicle }: VehicleDetailInfoProps) {
  const { user } = useAuth()
  const canRequestVehicle = user?.role === "CLIENT"

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary-700">
          {vehicle.marca}
        </p>
        <h1
          className="text-4xl leading-tight text-text-primary lg:text-5xl"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          {vehicle.modelo}
        </h1>
      </div>

      <div className="rounded-xl bg-surface p-6 shadow-[0_2px_16px_rgba(26,77,168,0.06)]">
        <div className="flex items-center justify-between">
          <span className="ds-body text-text-secondary">Diária</span>
          <span
            className="text-3xl text-accent"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            R$ {Number(vehicle.valorDiaria).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="rounded-xl bg-surface shadow-[0_2px_16px_rgba(26,77,168,0.06)]">
        {detailRows(vehicle).map((row, index) => (
          <div
            key={row.label}
            className={`flex items-center justify-between px-6 py-4 ${
              index < detailRows(vehicle).length - 1
                ? "border-b border-border/40"
                : ""
            }`}
          >
            <span className="ds-body text-text-secondary">{row.label}</span>
            <span className="text-sm font-semibold text-text-primary">{row.value}</span>
          </div>
        ))}
      </div>

      {canRequestVehicle &&
        (vehicle.disponivel ? (
          <Link
            href={`/veiculos/${vehicle.matricula}/solicitar`}
            className="block w-full rounded-xl bg-primary-700 py-4 text-center text-base font-semibold text-white transition-colors hover:bg-primary-800 active:bg-primary-900"
          >
            Solicitar Aluguel
          </Link>
        ) : (
          <button
            disabled
            className="w-full rounded-xl bg-primary-700 py-4 text-base font-semibold text-white opacity-40 cursor-not-allowed"
          >
            Indisponível
          </button>
        ))}
    </div>
  )
}
