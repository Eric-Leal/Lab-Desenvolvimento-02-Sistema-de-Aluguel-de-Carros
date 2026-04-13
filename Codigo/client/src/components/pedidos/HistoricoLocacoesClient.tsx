"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Car, CheckCircle2, Loader2, SearchX } from "lucide-react"
import { useClientePedidos } from "@/components/pedidos/useClientePedidos"
import { useAuth } from "@/components/providers/auth-provider"
import { contratoService, type ContratoResponse } from "@/services/contrato.service"

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(value: string) {
  if (!value) return "--"
  const normalized = value.includes("T") ? value : `${value}T00:00:00`
  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) return "--"
  return date.toLocaleDateString("pt-BR")
}

function getClassificacao(requerFinanciamento: boolean) {
  if (!requerFinanciamento) {
    return { letra: "A", label: "Excelente", note: "Histórico financeiro exemplar" }
  }
  return { letra: "B", label: "Bom", note: "Locação com apoio de financiamento" }
}

function getClassificacaoByScore(score?: string | null, fallbackRequiresFunding?: boolean) {
  const normalized = (score ?? "").trim().toUpperCase()
  if (normalized === "A") return { letra: "A", label: "Excelente", note: "Histórico financeiro exemplar" }
  if (normalized === "B") return { letra: "B", label: "Bom", note: "Histórico financeiro consistente" }
  if (normalized === "C") return { letra: "C", label: "Regular", note: "Perfil com atenção moderada" }
  if (normalized === "D") return { letra: "D", label: "Restrito", note: "Perfil financeiro com ressalvas" }
  return getClassificacao(Boolean(fallbackRequiresFunding))
}

export function HistoricoLocacoesClient() {
  const { isAuthenticated, isLoading } = useAuth()
  const { currentUserId, pedidos, vehiclesMap, loading, error } = useClientePedidos()
  const [contracts, setContracts] = useState<ContratoResponse[]>([])
  const [loadingContracts, setLoadingContracts] = useState(true)

  useEffect(() => {
    let active = true
    async function loadContracts() {
      setLoadingContracts(true)
      try {
        const data = await contratoService.listarTodos()
        if (active) setContracts(data)
      } catch {
        if (active) setContracts([])
      } finally {
        if (active) setLoadingContracts(false)
      }
    }
    void loadContracts()
    return () => {
      active = false
    }
  }, [])

  const historico = useMemo(
    () => pedidos.filter((p) => p.statusGeral === "CONTRATO_FECHADO" || p.statusGeral === "CONCLUIDO"),
    [pedidos]
  )

  const contractsByPedidoId = useMemo(() => {
    const map: Record<string, ContratoResponse> = {}
    contracts.forEach((contract) => {
      if (contract.pedidoId) {
        map[contract.pedidoId] = contract
      }
    })
    return map
  }, [contracts])

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-5 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
        <p className="font-semibold">Faça login para visualizar o histórico de locações.</p>
        <Link href="/login" className="mt-3 inline-flex rounded-md border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-800">
          Ir para login
        </Link>
      </div>
    )
  }

  if (!currentUserId) return null

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {loading || loadingContracts ? (
        <div className="flex items-center justify-center rounded-xl bg-surface py-14">
          <Loader2 size={22} className="animate-spin text-text-secondary" />
        </div>
      ) : historico.length === 0 ? (
        <div className="rounded-xl bg-surface px-6 py-16 text-center">
          <SearchX size={28} className="mx-auto text-text-secondary" />
          <p className="mt-3 text-lg font-semibold text-text-primary">Sem histórico de locações ainda</p>
          <p className="mt-1 ds-body text-text-secondary">Quando seus pedidos virarem contrato fechado ou concluído, eles aparecerão aqui.</p>
        </div>
      ) : (
        <section className="space-y-5">
          {historico.map((item) => {
            const vehicle = vehiclesMap[item.automovelMatricula] ?? null
            const image = vehicle?.imagens?.slice().sort((a, b) => a.ordem - b.ordem)[0]
            const contract = contractsByPedidoId[item.id]
            const diaria = contract ? contract.valorDiario : vehicle ? Number(vehicle.valorDiaria) : item.valorTotal
            const total = contract ? contract.valorTotal : item.valorTotal
            const classificacao = getClassificacaoByScore(contract?.scoreFinanceiro, item.requerFinanciamento)
            const entrada = contract ? contract.valorEntrada : item.requerFinanciamento ? total * 0.25 : total
            const restante = contract ? contract.valorRestante : Math.max(0, total - entrada)
            const contratoData = contract?.criadoEm || item.atualizadoEm || item.criadoEm
            const statusContrato = contract?.status
              ? contract.status === "ENCERRADO" ? "ENCERRADO" : "ATIVO"
              : item.statusGeral === "CONCLUIDO" ? "ENCERRADO" : "ATIVO"

            return (
              <article key={item.id} className="rounded-xl bg-surface p-5 shadow-[0_2px_16px_rgba(26,77,168,0.07)]">
                <div className="grid gap-5 sm:grid-cols-[112px_1fr]">
                  <div className="relative h-28 w-28 overflow-hidden rounded-lg bg-surface-2">
                    {image ? (
                      <Image
                        src={image.imageUrl}
                        alt={vehicle ? `${vehicle.marca} ${vehicle.modelo}` : `Veículo ${item.automovelMatricula}`}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Car size={24} className="text-text-secondary" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-3xl text-text-primary" style={{ fontFamily: "var(--font-dm-serif)" }}>
                        {vehicle ? `${vehicle.marca} ${vehicle.modelo}` : `Veículo ${item.automovelMatricula}`}
                      </h3>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/50 dark:text-green-300">
                        {statusContrato}
                      </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="ds-caption text-text-secondary">Período</p>
                        <p className="mt-1 ds-body text-text-primary">{formatDate(item.dataInicio)} → {formatDate(item.dataFim)}</p>
                      </div>
                      <div>
                        <p className="ds-caption text-text-secondary">Diária</p>
                        <p className="mt-1 text-xl text-text-primary" style={{ fontFamily: "var(--font-dm-serif)" }}>R$ {formatBRL(diaria)}</p>
                      </div>
                      <div>
                        <p className="ds-caption text-text-secondary">Total</p>
                        <p className="mt-1 text-xl text-accent" style={{ fontFamily: "var(--font-dm-serif)" }}>R$ {formatBRL(total)}</p>
                      </div>
                      <div>
                        <p className="ds-caption text-text-secondary">Classificação Financeira</p>
                        <div className="mt-1 flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-green-600 dark:text-green-400" />
                          <span className="font-semibold text-green-700 dark:text-green-300">{classificacao.letra}</span>
                          <span className="ds-body text-text-secondary">— {classificacao.label}</span>
                        </div>
                      </div>
                    </div>

                    <p className="ds-caption text-text-secondary">{contract?.motivo || classificacao.note}</p>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="ds-caption text-text-secondary">Entrada</p>
                        <p className="mt-1 ds-body text-text-primary">R$ {formatBRL(entrada)}</p>
                      </div>
                      <div>
                        <p className="ds-caption text-text-secondary">Restante</p>
                        <p className="mt-1 ds-body text-text-primary">R$ {formatBRL(restante)}</p>
                      </div>
                      <div>
                        <p className="ds-caption text-text-secondary">Data do Contrato</p>
                        <p className="mt-1 ds-body text-text-primary">{formatDate(contratoData)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </div>
  )
}
