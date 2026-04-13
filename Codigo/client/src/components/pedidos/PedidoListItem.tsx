"use client"

import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Car, Pencil, Send, Trash2, XCircle } from "lucide-react"
import type { PedidoResponse } from "@/services/rentals.service"
import type { Automovel } from "@/types/vehicle"
import type { PedidoAction } from "@/components/pedidos/pedido-status"
import { getAllowedActions } from "@/components/pedidos/pedido-status"
import { PedidoStatusBadge } from "@/components/pedidos/PedidoStatusBadge"

interface PedidoListItemProps {
  pedido: PedidoResponse
  vehicle: Automovel | null
  onAction: (pedido: PedidoResponse, action: PedidoAction) => void
  isBusy?: boolean
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(value: string) {
  const normalized = value.includes("T") ? value : `${value}T00:00:00`
  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) return "--"
  return date.toLocaleDateString("pt-BR")
}

export function PedidoListItem({ pedido, vehicle, onAction, isBusy = false }: PedidoListItemProps) {
  const actions = getAllowedActions(pedido.statusGeral)
  const image = vehicle?.imagens?.slice().sort((a, b) => a.ordem - b.ordem)[0]

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="grid gap-0 md:grid-cols-[320px_1fr]">
        <div className="relative h-48 bg-surface-2 md:h-full">
          {image ? (
            <Image
              src={image.imageUrl}
              alt={vehicle ? `${vehicle.marca} ${vehicle.modelo}` : `Veículo ${pedido.automovelMatricula}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Car size={34} className="text-text-secondary" />
            </div>
          )}
          <div className="absolute left-3 top-3">
            <PedidoStatusBadge status={pedido.statusGeral} />
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="ds-caption uppercase tracking-wider text-text-secondary">Pedido #{pedido.id.slice(0, 8).toUpperCase()}</p>
              <h3 className="mt-1 text-2xl text-text-primary" style={{ fontFamily: "var(--font-dm-serif)" }}>
                {vehicle ? `${vehicle.marca} ${vehicle.modelo}` : `Matrícula ${pedido.automovelMatricula}`}
              </h3>
              <p className="mt-1 ds-body text-text-secondary">
                {vehicle ? `Placa ${vehicle.placa} • Ano ${vehicle.ano}` : "Veículo sem dados detalhados"}
              </p>
            </div>

            <p className="text-2xl text-accent" style={{ fontFamily: "var(--font-dm-serif)" }}>
              R$ {formatBRL(pedido.valorTotal)}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2 ds-body">
              <CalendarDays size={16} className="text-text-secondary" />
              {formatDate(pedido.dataInicio)} → {formatDate(pedido.dataFim)}
            </div>
            <div className="rounded-lg bg-surface-2 px-3 py-2 ds-body">
              {pedido.requerFinanciamento ? "Com financiamento" : "Sem financiamento"}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/pedidos/${pedido.id}`}
              className="rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-2"
            >
              Ver detalhes
            </Link>

            {actions.includes("edit") && (
              <Link
                href={`/pedidos/${pedido.id}/editar`}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-2"
              >
                <Pencil size={14} /> Editar
              </Link>
            )}

            {actions.includes("submit") && (
              <button
                onClick={() => onAction(pedido, "submit")}
                disabled={isBusy}
                className="inline-flex items-center gap-1 rounded-md bg-(--primary-700) px-3 py-2 text-sm font-semibold text-white transition hover:bg-(--primary-800) disabled:opacity-50"
              >
                <Send size={14} /> Submeter
              </button>
            )}

            {actions.includes("cancel") && (
              <button
                onClick={() => onAction(pedido, "cancel")}
                disabled={isBusy}
                className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
              >
                <XCircle size={14} /> Cancelar
              </button>
            )}

            {actions.includes("delete") && (
              <button
                onClick={() => onAction(pedido, "delete")}
                disabled={isBusy}
                className="inline-flex items-center gap-1 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
              >
                <Trash2 size={14} /> Excluir
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
