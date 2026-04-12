"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Loader2, SearchX } from "lucide-react"
import { useRouter } from "next/navigation"
import { rentalsService, type PedidoResponse } from "@/services/rentals.service"
import { PedidoListItem } from "@/components/pedidos/PedidoListItem"
import { PedidoConfirmModal } from "@/components/pedidos/PedidoConfirmModal"
import type { PedidoAction } from "@/components/pedidos/pedido-status"
import { useClientePedidos } from "@/components/pedidos/useClientePedidos"

interface ConfirmState {
  open: boolean
  action: PedidoAction | null
  pedido: PedidoResponse | null
}

const initialConfirmState: ConfirmState = {
  open: false,
  action: null,
  pedido: null,
}

type FilterKey =
  | "todos"
  | "rascunho"
  | "pendente-locador"
  | "aprovado-locador"
  | "analise-banco"
  | "contrato-fechado"
  | "cancelado"

const FILTER_OPTIONS: Array<{ key: FilterKey; label: string }> = [
  { key: "todos", label: "Todos" },
  { key: "rascunho", label: "RASCUNHO" },
  { key: "pendente-locador", label: "PENDENTE LOCADOR" },
  { key: "aprovado-locador", label: "APROVADO LOCADOR" },
  { key: "analise-banco", label: "EM ANALISE BANCO" },
  { key: "contrato-fechado", label: "CONTRATO FECHADO" },
  { key: "cancelado", label: "CANCELADO" },
]

export function MeusPedidosClient() {
  const router = useRouter()
  const { currentClient, pedidos, vehiclesMap, loading, error, setError, reload } = useClientePedidos()

  const [activeFilter, setActiveFilter] = useState<FilterKey>("todos")
  const [busyId, setBusyId] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<ConfirmState>(initialConfirmState)

  const resumo = useMemo(() => {
    const total = pedidos.length
    const rascunhos = pedidos.filter((p) => p.statusGeral === "RASCUNHO").length
    const submetidos = pedidos.filter((p) => p.statusGeral === "SUBMETIDO").length
    const fechados = pedidos.filter((p) => p.statusGeral === "CONTRATO_FECHADO").length
    return { total, rascunhos, submetidos, fechados }
  }, [pedidos])

  const pedidosFiltrados = useMemo(() => {
    if (activeFilter === "todos") return pedidos
    if (activeFilter === "rascunho") return pedidos.filter((p) => p.statusGeral === "RASCUNHO")
    if (activeFilter === "pendente-locador") {
      return pedidos.filter((p) => p.statusLocador === "PENDENTE" && p.statusGeral !== "RASCUNHO" && p.statusGeral !== "CANCELADO")
    }
    if (activeFilter === "aprovado-locador") return pedidos.filter((p) => p.statusLocador === "APROVADO")
    if (activeFilter === "analise-banco") return pedidos.filter((p) => p.statusGeral === "EM_ANALISE_BANCO")
    if (activeFilter === "contrato-fechado") return pedidos.filter((p) => p.statusGeral === "CONTRATO_FECHADO")
    if (activeFilter === "cancelado") return pedidos.filter((p) => p.statusGeral === "CANCELADO")
    return pedidos
  }, [activeFilter, pedidos])

  function askConfirm(pedido: PedidoResponse, action: PedidoAction) {
    setConfirm({ open: true, pedido, action })
  }

  function closeConfirm() {
    setConfirm(initialConfirmState)
  }

  async function performAction() {
    if (!confirm.pedido || !confirm.action) return

    const pedido = confirm.pedido
    const action = confirm.action
    setBusyId(pedido.id)
    setError(null)

    try {
      if (action === "submit") {
        await rentalsService.submeter(pedido.id)
      }
      if (action === "cancel") {
        await rentalsService.cancelar(pedido.id)
      }
      if (action === "delete") {
        await rentalsService.excluirRascunho(pedido.id)
      }

      closeConfirm()
      await reload()
      if (action === "submit") router.push(`/pedidos/${pedido.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao executar ação")
    } finally {
      setBusyId(null)
    }
  }

  if (!currentClient) {
    return (
      <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-5 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
        Selecione um cliente no modo de desenvolvimento para visualizar os pedidos.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl bg-surface p-4">
          <p className="ds-caption uppercase tracking-wider text-text-secondary">Total</p>
          <p className="mt-1 text-3xl text-text-primary" style={{ fontFamily: "var(--font-dm-serif)" }}>{resumo.total}</p>
        </article>
        <article className="rounded-xl bg-surface p-4">
          <p className="ds-caption uppercase tracking-wider text-text-secondary">Rascunhos</p>
          <p className="mt-1 text-3xl text-text-primary" style={{ fontFamily: "var(--font-dm-serif)" }}>{resumo.rascunhos}</p>
        </article>
        <article className="rounded-xl bg-surface p-4">
          <p className="ds-caption uppercase tracking-wider text-text-secondary">Submetidos</p>
          <p className="mt-1 text-3xl text-text-primary" style={{ fontFamily: "var(--font-dm-serif)" }}>{resumo.submetidos}</p>
        </article>
        <article className="rounded-xl bg-surface p-4">
          <p className="ds-caption uppercase tracking-wider text-text-secondary">Fechados</p>
          <p className="mt-1 text-3xl text-text-primary" style={{ fontFamily: "var(--font-dm-serif)" }}>{resumo.fechados}</p>
        </article>
      </section>

      <section className="overflow-x-auto">
        <div className="inline-flex min-w-full gap-2 rounded-xl bg-surface p-2">
          {FILTER_OPTIONS.map((option) => {
            const active = activeFilter === option.key
            return (
              <button
                key={option.key}
                onClick={() => setActiveFilter(option.key)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${active
                  ? "bg-(--primary-700) text-white"
                  : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-xl bg-surface py-14">
          <Loader2 size={22} className="animate-spin text-text-secondary" />
        </div>
      ) : pedidosFiltrados.length === 0 ? (
        <div className="rounded-xl bg-surface px-6 py-16 text-center">
          <SearchX size={28} className="mx-auto text-text-secondary" />
          <p className="mt-3 text-lg font-semibold text-text-primary">Nenhum pedido encontrado para este filtro</p>
          <p className="mt-1 ds-body text-text-secondary">Troque o filtro ou crie um novo pedido na página de veículos.</p>
        </div>
      ) : (
        <section className="space-y-5">
          {pedidosFiltrados.map((pedido) => (
            <PedidoListItem
              key={pedido.id}
              pedido={pedido}
              vehicle={vehiclesMap[pedido.automovelMatricula] ?? null}
              isBusy={busyId === pedido.id}
              onAction={askConfirm}
            />
          ))}
        </section>
      )}

      <PedidoConfirmModal
        open={confirm.open}
        loading={busyId != null}
        onClose={closeConfirm}
        onConfirm={performAction}
        tone={confirm.action === "cancel" || confirm.action === "submit" ? "warning" : "danger"}
        title={
          confirm.action === "submit"
            ? "Confirmar submissão"
            : confirm.action === "cancel"
              ? "Confirmar cancelamento"
              : "Confirmar exclusão"
        }
        description={
          confirm.action === "submit"
            ? "O pedido sairá do rascunho e seguirá para análise do locador."
            : confirm.action === "cancel"
              ? "O pedido será marcado como cancelado e não seguirá no fluxo."
              : "Esta ação remove o rascunho permanentemente."
        }
        confirmText={
          confirm.action === "submit"
            ? "Submeter pedido"
            : confirm.action === "cancel"
              ? "Cancelar pedido"
              : "Excluir rascunho"
        }
      />
    </div>
  )
}
