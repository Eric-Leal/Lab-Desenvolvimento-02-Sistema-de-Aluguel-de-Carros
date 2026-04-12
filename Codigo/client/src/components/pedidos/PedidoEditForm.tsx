"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import type { Automovel } from "@/types/vehicle"
import type { PedidoResponse } from "@/services/rentals.service"
import type { DevClient } from "@/store/use-dev-session"
import { rentalsService } from "@/services/rentals.service"

interface PedidoEditFormProps {
  pedido: PedidoResponse
  vehicle: Automovel
  currentClient: DevClient
}

const FINANCING_THRESHOLD = 0.30

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function diffDays(start: string, end: string): number {
  const d1 = new Date(start)
  const d2 = new Date(end)
  const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

function normalizeToInputDate(value: string) {
  if (!value) return ""
  if (value.includes("T")) return value.slice(0, 10)
  return value
}

export function PedidoEditForm({ pedido, vehicle, currentClient }: PedidoEditFormProps) {
  const router = useRouter()
  const today = new Date().toISOString().split("T")[0]

  const [dataInicio, setDataInicio] = useState(normalizeToInputDate(pedido.dataInicio))
  const [dataFim, setDataFim] = useState(normalizeToInputDate(pedido.dataFim))
  const [loading, setLoading] = useState<"save" | "submit" | null>(null)
  const [error, setError] = useState<string | null>(null)

  const primaryImage = vehicle.imagens?.slice().sort((a, b) => a.ordem - b.ordem)[0]
  const dias = useMemo(() => (dataInicio && dataFim ? diffDays(dataInicio, dataFim) : 0), [dataInicio, dataFim])
  const valorTotal = useMemo(() => dias * Number(vehicle.valorDiaria), [dias, vehicle.valorDiaria])
  const limite = currentClient.rendimentoTotal * FINANCING_THRESHOLD
  const precisaFinanciamento = valorTotal > 0 && valorTotal > limite
  const datesValid = dias > 0

  async function handleSave(submeter: boolean) {
    if (!datesValid) return
    setLoading(submeter ? "submit" : "save")
    setError(null)

    try {
      await rentalsService.atualizar(pedido.id, {
        dataInicio,
        dataFim,
        valorTotal,
      })

      if (submeter) {
        await rentalsService.submeter(pedido.id)
      }

      router.push(`/pedidos/${pedido.id}${submeter ? "?novo=true" : ""}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar pedido")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="space-y-4">
        <div className="overflow-hidden rounded-xl bg-surface shadow-[0_2px_16px_rgba(26,77,168,0.07)]">
          <div className="relative aspect-4/3 overflow-hidden bg-surface-2">
            {primaryImage ? (
              <Image
                src={primaryImage.imageUrl}
                alt={`${vehicle.marca} ${vehicle.modelo}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-text-disabled">
                Sem foto disponível
              </div>
            )}
          </div>

          <div className="p-5">
            <p className="ds-caption font-semibold uppercase tracking-widest text-text-secondary">{vehicle.marca}</p>
            <h2 className="mt-0.5 text-2xl text-text-primary" style={{ fontFamily: "var(--font-dm-serif)" }}>
              {vehicle.modelo}
            </h2>
            <p className="mt-3 text-2xl font-bold text-accent" style={{ fontFamily: "var(--font-dm-serif)" }}>
              R$ {formatBRL(Number(vehicle.valorDiaria))}/dia
            </p>
            <p className="ds-caption mt-2 text-text-secondary">
              Placa: {vehicle.placa} • Ano: {vehicle.ano}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl bg-surface p-6 shadow-[0_2px_16px_rgba(26,77,168,0.07)]">
          <h2 className="mb-6 text-xl text-text-primary" style={{ fontFamily: "var(--font-dm-serif)" }}>
            Editar Período da Locação
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="ds-caption font-semibold uppercase tracking-wider text-text-secondary">Data Início</label>
              <input
                type="date"
                min={today}
                value={dataInicio}
                onChange={(e) => {
                  setDataInicio(e.target.value)
                  if (dataFim && e.target.value >= dataFim) setDataFim("")
                }}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm text-text-primary outline-none transition focus:border-border-brand focus:ring-2 focus:ring-ring/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="ds-caption font-semibold uppercase tracking-wider text-text-secondary">Data Fim</label>
              <input
                type="date"
                min={dataInicio || today}
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm text-text-primary outline-none transition focus:border-border-brand focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>

          {datesValid && (
            <div className="mt-6 space-y-3 rounded-lg bg-surface-2 p-4">
              <div className="flex items-center justify-between">
                <span className="ds-body text-text-secondary">{dias} {dias === 1 ? "dia" : "dias"} × R$ {formatBRL(Number(vehicle.valorDiaria))}</span>
                <span className="ds-body font-medium text-text-primary">R$ {formatBRL(valorTotal)}</span>
              </div>
              <div className="border-t border-border/60 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-text-primary">Total</span>
                  <span className="text-2xl text-accent" style={{ fontFamily: "var(--font-dm-serif)" }}>
                    R$ {formatBRL(valorTotal)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {datesValid && (
          precisaFinanciamento ? (
            <div className="flex gap-3 rounded-xl border border-amber-300/60 bg-amber-50 p-4 dark:border-amber-700/40 dark:bg-amber-950/40">
              <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Financiamento necessário</p>
                <p className="mt-0.5 ds-caption text-amber-700 dark:text-amber-400">
                  O valor total excede 30% do rendimento mensal (R$ {formatBRL(currentClient.rendimentoTotal)}).
                </p>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 rounded-xl border border-green-300/60 bg-green-50 p-4 dark:border-green-700/40 dark:bg-green-950/40">
              <CheckCircle size={20} className="mt-0.5 shrink-0 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm font-semibold text-green-800 dark:text-green-300">Compatível com seu rendimento</p>
                <p className="mt-0.5 ds-caption text-green-700 dark:text-green-400">O valor está dentro do limite de 30% da sua renda.</p>
              </div>
            </div>
          )
        )}

        {error && (
          <div className="rounded-xl border border-red-300/60 bg-red-50 px-4 py-3 ds-caption text-red-700 dark:border-red-700/40 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            disabled={!datesValid || loading !== null}
            onClick={() => handleSave(false)}
            className="flex-1 rounded-xl border border-border bg-surface py-4 text-sm font-semibold text-text-primary transition hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading === "save" ? (
              <span className="flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /> Salvando...</span>
            ) : "Salvar alterações"}
          </button>

          <button
            disabled={!datesValid || loading !== null}
            onClick={() => handleSave(true)}
            className="flex-1 rounded-xl bg-(--primary-700) py-4 text-sm font-semibold text-white transition hover:bg-(--primary-800) disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading === "submit" ? (
              <span className="flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /> Submetendo...</span>
            ) : "Salvar e submeter"}
          </button>
        </div>
      </div>
    </div>
  )
}
