"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Loader2,
  Car,
  CalendarDays,
  DollarSign,
  CreditCard,
  Paperclip,
  Hash,
} from "lucide-react"
import type { PedidoResponse } from "@/services/rentals.service"
import type { Automovel } from "@/types/vehicle"
import { useCurrentUser } from "@/hooks/use-current-user"
import { rentalsService } from "@/services/rentals.service"
import { vehiclesService } from "@/services/vehicles.service"

interface PedidoDetailLoaderProps {
  pedidoId: string
  isNew: boolean
}

interface PedidoDetailClientProps {
  pedido: PedidoResponse
  vehicle: Automovel | null
  isNew: boolean
}

export function PedidoDetailLoader({ pedidoId, isNew }: PedidoDetailLoaderProps) {
  const [pedido, setPedido] = useState<PedidoResponse | null>(null)
  const [vehicle, setVehicle] = useState<Automovel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const pedidoData = await rentalsService.buscarPorId(pedidoId)
        if (cancelled) return

        setPedido(pedidoData)

        try {
          const vehicleData = await vehiclesService.buscarPorMatricula(pedidoData.automovelMatricula)
          if (!cancelled) setVehicle(vehicleData)
        } catch {
          if (!cancelled) setVehicle(null)
        }
      } catch {
        if (!cancelled) {
          setPedido(null)
          setVehicle(null)
          setError("Nao foi possivel carregar este pedido. Ele pode nao existir ou voce nao tem permissao de acesso.")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [pedidoId])

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-border bg-surface p-10">
        <Loader2 size={22} className="animate-spin text-text-secondary" />
      </div>
    )
  }

  if (!pedido) {
    return (
      <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
        <p className="text-sm text-text-secondary">{error ?? "Pedido nao encontrado."}</p>
        <Link
          href="/pedidos"
          className="inline-flex rounded-md border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface"
        >
          Voltar para pedidos
        </Link>
      </div>
    )
  }

  return <PedidoDetailClient pedido={pedido} vehicle={vehicle} isNew={isNew} />
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const normalized = value.includes("T") ? value : `${value}T00:00:00`
  const parsed = new Date(normalized)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function formatDate(value: string | null | undefined): string {
  const parsed = parseDate(value)
  if (!parsed) return "Data inválida"
  return parsed.toLocaleDateString("pt-BR")
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; Icon: typeof CheckCircle }> = {
    RASCUNHO:   { label: "Rascunho",   color: "text-text-secondary bg-surface-2 border-border",              Icon: Paperclip },
    PENDENTE:   { label: "Pendente",   color: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/40 dark:border-amber-800",   Icon: Clock },
    APROVADO:   { label: "Aprovado",   color: "text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/40 dark:border-green-800",    Icon: CheckCircle },
    RECUSADO:   { label: "Recusado",   color: "text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/40 dark:border-red-800",                Icon: XCircle },
    CANCELADO:  { label: "Cancelado",  color: "text-text-secondary bg-surface-2 border-border",              Icon: XCircle },
    CONCLUIDO:  { label: "Concluído",  color: "text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/40 dark:border-green-800",    Icon: CheckCircle },
    SUBMETIDO:  { label: "Submetido",  color: "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950/40 dark:border-blue-800",          Icon: Clock },
  }

  const config = map[status] ?? { label: status, color: "text-text-secondary bg-surface-2 border-border", Icon: Paperclip }
  const { label, color, Icon } = config

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${color}`}>
      <Icon size={14} />
      {label}
    </span>
  )
}

export function PedidoDetailClient({ pedido, vehicle, isNew }: PedidoDetailClientProps) {
  const [showSuccess, setShowSuccess] = useState(isNew)
  const { profile: currentClient } = useCurrentUser()

  useEffect(() => {
    if (isNew) {
      const t = setTimeout(() => setShowSuccess(false), 6000)
      return () => clearTimeout(t)
    }
  }, [isNew])

  const inicio = parseDate(pedido.dataInicio)
  const fim = parseDate(pedido.dataFim)
  const dias = inicio && fim
    ? Math.max(0, Math.round((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)))
    : 0

  const primaryImage = vehicle?.imagens?.sort((a, b) => a.ordem - b.ordem)[0]
  const rendaCliente = currentClient?.id === pedido.clienteId ? currentClient.rendimentoTotal : null
  const limiteEstimado = rendaCliente != null ? rendaCliente * 0.3 : null
  const financiamentoEstimado = limiteEstimado != null ? pedido.valorTotal > limiteEstimado : false

  return (
    <div className="space-y-6">
      {/* Banner de sucesso (desaparece após 6s) */}
      {showSuccess && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/40">
          <CheckCircle size={20} className="mt-0.5 shrink-0 text-green-600 dark:text-green-400" />
          <div>
            <p className="font-semibold text-green-800 dark:text-green-300">
              {pedido.statusGeral === "RASCUNHO" ? "Rascunho salvo com sucesso!" : "Pedido enviado com sucesso!"}
            </p>
            <p className="mt-0.5 text-sm text-green-700 dark:text-green-400">
              {pedido.statusGeral === "RASCUNHO"
                ? "Seu rascunho foi criado. Você pode enviá-lo quando estiver pronto."
                : "Seu pedido foi submetido e aguarda aprovação do locador."}
            </p>
          </div>
        </div>
      )}

      {/* Card principal */}
      <div className="rounded-2xl border border-border bg-surface p-6 space-y-6">
        {/* Veículo em destaque */}
        {vehicle && (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-2">
            <div className="relative h-56 w-full sm:h-72">
              {primaryImage ? (
                <Image
                  src={primaryImage.imageUrl}
                  alt={`${vehicle.marca} ${vehicle.modelo}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 768px"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-surface">
                  <Car size={36} className="text-text-secondary" />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 via-black/10 to-transparent px-5 py-4">
                <p className="text-xl font-semibold text-white sm:text-2xl">
                  {vehicle.marca} {vehicle.modelo}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs sm:text-sm">
                  <span className="rounded-full bg-black/35 px-3 py-1 text-white">Placa {vehicle.placa}</span>
                  <span className="rounded-full bg-black/35 px-3 py-1 text-white">Ano {vehicle.ano}</span>
                  <span className="rounded-full bg-black/35 px-3 py-1 text-white">Matrícula {vehicle.matricula}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cabeçalho: ID + status */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">ID do Pedido</p>
            <p className="font-mono text-sm text-text-primary break-all">{pedido.id}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div>
              <p className="text-xs text-text-secondary mb-1">Status Geral</p>
              <StatusBadge status={pedido.statusGeral} />
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-1">Status Locador</p>
              <StatusBadge status={pedido.statusLocador} />
            </div>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Grid de informações */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Veículo */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2">
              <Car size={18} className="text-text-secondary" />
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider">Veículo</p>
              {vehicle ? (
                <>
                  <Link
                    href={`/veiculos/${pedido.automovelMatricula}`}
                    className="font-medium text-text-primary hover:text-accent-default transition-colors"
                  >
                    {vehicle.marca} {vehicle.modelo}
                  </Link>
                  <p className="text-sm text-text-secondary">Placa {vehicle.placa} • Ano {vehicle.ano}</p>
                </>
              ) : (
                <p className="font-medium text-text-primary">Matrícula #{pedido.automovelMatricula}</p>
              )}
            </div>
          </div>

          {/* Período */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2">
              <CalendarDays size={18} className="text-text-secondary" />
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider">Período</p>
              <p className="font-medium text-text-primary">
                {formatDate(pedido.dataInicio)} → {formatDate(pedido.dataFim)}
              </p>
              <p className="text-sm text-text-secondary">
                {dias > 0 ? `${dias} dia${dias !== 1 ? "s" : ""}` : "Período inválido"}
              </p>
            </div>
          </div>

          {/* Valor total */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2">
              <DollarSign size={18} className="text-text-secondary" />
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider">Valor Total</p>
              <p className="font-medium text-text-primary">R$ {formatBRL(pedido.valorTotal)}</p>
            </div>
          </div>

          {/* Matrícula */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2">
              <Hash size={18} className="text-text-secondary" />
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider">Matrícula</p>
              <p className="font-medium text-text-primary">#{pedido.automovelMatricula}</p>
            </div>
          </div>
        </div>

        {/* Financiamento */}
        {pedido.requerFinanciamento && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-300">Requer Financiamento</p>
              <p className="mt-0.5 text-sm text-amber-700 dark:text-amber-400">
                O valor deste pedido excede 30% do rendimento mensal. O banco será acionado para análise.
                {pedido.bancoId && (
                  <span className="ml-1 font-mono">Banco ID: {pedido.bancoId}</span>
                )}
              </p>
            </div>
          </div>
        )}

        {!pedido.requerFinanciamento && pedido.statusGeral === "RASCUNHO" && limiteEstimado != null && (
          <div className={`flex items-start gap-3 rounded-xl border p-4 ${financiamentoEstimado
            ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40"
            : "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/40"
          }`}>
            <AlertTriangle
              size={18}
              className={`mt-0.5 shrink-0 ${financiamentoEstimado
                ? "text-amber-600 dark:text-amber-400"
                : "text-green-600 dark:text-green-400"
              }`}
            />
            <div>
              <p className={`font-medium ${financiamentoEstimado
                ? "text-amber-800 dark:text-amber-300"
                : "text-green-800 dark:text-green-300"
              }`}>
                {financiamentoEstimado ? "Estimativa: vai precisar de financiamento" : "Estimativa: sem financiamento"}
              </p>
              <p className={`mt-0.5 text-sm ${financiamentoEstimado
                ? "text-amber-700 dark:text-amber-400"
                : "text-green-700 dark:text-green-400"
              }`}>
                Limite de 30% da renda: R$ {formatBRL(limiteEstimado)}. A definição final ocorre ao submeter o pedido.
              </p>
            </div>
          </div>
        )}

        {!pedido.requerFinanciamento && pedido.statusGeral !== "RASCUNHO" && (
          <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/40">
            <CreditCard size={18} className="mt-0.5 shrink-0 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-700 dark:text-green-400">
              Pagamento direto — sem necessidade de financiamento bancário.
            </p>
          </div>
        )}
      </div>

      {/* Ações */}
      <div className="flex gap-3">
        <Link
          href="/veiculos"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-2"
        >
          Ver outros veículos
        </Link>
        {vehicle && (
          <Link
            href={`/veiculos/${pedido.automovelMatricula}`}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-2"
          >
            Ver veículo
          </Link>
        )}
      </div>
    </div>
  )
}
