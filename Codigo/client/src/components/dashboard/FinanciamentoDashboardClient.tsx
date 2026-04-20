'use client'

import { useAuthUserId } from '@/hooks/use-auth-user-id'
import { cn } from '@/lib/utils'
import { rentalsService, type PedidoResponse } from '@/services/rentals.service'
import { usersService, type ClientBasic } from '@/services/users.service'
import { vehiclesService } from '@/services/vehicles.service'
import { CheckCircle2, Eye, Landmark, XCircle } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'

type DashboardMode = 'banco' | 'financeiro'
type HistoricoDecisao = 'APROVADO' | 'REPROVADO'

type DashboardAddress = {
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
}

type DashboardPedido = {
  id: string
  clienteId: string
  veiculoNome: string
  placa: string
  locadorNome: string
  periodoLabel: string
  dataPedidoLabel: string
  valorTotal: number
  imagemUrl: string
  clienteNome: string
  clienteCpf: string
  clienteProfissao: string
  clienteRendimento: number
  clienteEndereco: string
}

type HistoricoItem = {
  id: string
  nome: string
  valor: number
  decisao: HistoricoDecisao
  atualizadoEm: string
}

interface FinanciamentoDashboardClientProps {
  mode: DashboardMode
  heading: string
  subtitle: string
}


function formatDateOnly(value: string): string {
  if (!value) return ''
  if (value.includes('T')) return value.split('T')[0]
  return value
}

function formatDateRange(pedido: PedidoResponse): string {
  return `${formatDateOnly(pedido.dataInicio)} -> ${formatDateOnly(pedido.dataFim)}`
}

function formatCurrency(value: number): string {
  return `R$ ${Number(value || 0).toFixed(2)}`
}

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length !== 11) return value
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

function resolveAddress(client: ClientBasic | null): DashboardAddress {
  if (!client) return {}
  return client.endereco || client.address || client['endereço'] || {}
}

function buildAddressLabel(address: DashboardAddress): string {
  const street = [address.logradouro, address.numero].filter(Boolean).join(', ')
  const cityState = [address.cidade, address.estado].filter(Boolean).join('/')
  if (!street && !cityState) return '—'
  if (!street) return cityState
  if (!cityState) return street
  return `${street} - ${cityState}`
}

export function FinanciamentoDashboardClient({ mode, heading, subtitle }: FinanciamentoDashboardClientProps) {
  const userId = useAuthUserId()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingPedidos, setPendingPedidos] = useState<DashboardPedido[]>([])
  const [historico, setHistorico] = useState<HistoricoItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hydratePedidos = useCallback(async (pedidos: PedidoResponse[]): Promise<DashboardPedido[]> => {
    const vehiclesSettled = await Promise.allSettled(
      pedidos.map((pedido) => vehiclesService.buscarPorMatricula(pedido.automovelMatricula))
    )

    const vehiclesMap = new Map<number, Awaited<ReturnType<typeof vehiclesService.buscarPorMatricula>>>()
    vehiclesSettled.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        vehiclesMap.set(pedidos[index].automovelMatricula, result.value)
      }
    })

    const clientsSettled = await Promise.allSettled(
      pedidos.map((pedido) => usersService.buscarClient(pedido.clienteId))
    )

    const clientMap = new Map<string, ClientBasic>()
    clientsSettled.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        clientMap.set(pedidos[index].clienteId, result.value)
      }
    })

    const locadorIds = Array.from(
      new Set(
        Array.from(vehiclesMap.values())
          .map((vehicle) => vehicle.locadorOriginalId)
          .filter(Boolean)
      )
    )

    let locadorMap: Record<string, string> = {}
    if (locadorIds.length > 0) {
      try {
        locadorMap = await usersService.buscarAgents(locadorIds)
      } catch {
        locadorMap = {}
      }
    }

    return pedidos.map((pedido) => {
      const vehicle = vehiclesMap.get(pedido.automovelMatricula)
      const client = clientMap.get(pedido.clienteId) ?? null
      const address = resolveAddress(client)
      const firstImage = vehicle?.imagens?.slice().sort((a, b) => a.ordem - b.ordem)[0]?.imageUrl

      return {
        id: pedido.id,
        clienteId: pedido.clienteId,
        veiculoNome: vehicle ? `${vehicle.marca} ${vehicle.modelo}` : `Veículo ${pedido.automovelMatricula}`,
        placa: vehicle?.placa ?? '—',
        locadorNome: vehicle?.locadorOriginalId ? locadorMap[vehicle.locadorOriginalId] || 'Locador' : 'Locador',
        periodoLabel: formatDateRange(pedido),
        dataPedidoLabel: formatDateOnly(pedido.criadoEm),
        valorTotal: pedido.valorTotal,
        imagemUrl: firstImage || '/images/carro.webp',
        clienteNome: client?.nome || 'Cliente não identificado',
        clienteCpf: client?.documento || '—',
        clienteProfissao: client?.profissao || '—',
        clienteRendimento: Number(client?.rendimentoTotal || 0),
        clienteEndereco: buildAddressLabel(address),
      }
    })
  }, [])

  const loadDashboardData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let pendentes: PedidoResponse[] = []

      if (mode === 'financeiro') {
        if (!userId) {
          setPendingPedidos([])
          setSelectedId(null)
          return
        }
        pendentes = await rentalsService.listarPendentesLocador(userId)
      } else {
        pendentes = await rentalsService.listarDisponiveisBanco()
      }

      const hydrated = await hydratePedidos(pendentes)
      setPendingPedidos(hydrated)
      setSelectedId(hydrated[0]?.id ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos.')
      setPendingPedidos([])
      setSelectedId(null)
    } finally {
      setLoading(false)
    }
  }, [hydratePedidos, mode, userId])

  useEffect(() => {
    void loadDashboardData()
  }, [loadDashboardData])

  const selectedPedido = useMemo(
    () => pendingPedidos.find((pedido) => pedido.id === selectedId) ?? null,
    [pendingPedidos, selectedId]
  )

  const aprovados = useMemo(() => historico.filter((item) => item.decisao === 'APROVADO').length, [historico])
  const reprovados = useMemo(() => historico.filter((item) => item.decisao === 'REPROVADO').length, [historico])

  async function handleDecision(decisao: HistoricoDecisao) {
    if (!selectedPedido || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      if (mode === 'financeiro') {
        if (decisao === 'APROVADO') {
          await rentalsService.aprovarLocador(selectedPedido.id)
        } else {
          await rentalsService.reprovarLocador(selectedPedido.id)
        }
      } else {
        if (!userId) {
          throw new Error('Usuário do banco não identificado.')
        }
        if (decisao === 'APROVADO') {
          await rentalsService.aprovarFinanciamento(selectedPedido.id, userId)
        } else {
          await rentalsService.reprovarFinanciamento(selectedPedido.id, userId)
        }
      }

      let nextSelectedId: string | null = null
      setPendingPedidos((current) => {
        const remaining = current.filter((pedido) => pedido.id !== selectedPedido.id)
        nextSelectedId = remaining[0]?.id ?? null
        return remaining
      })

      setSelectedId(nextSelectedId)
      setHistorico((current) => [
        {
          id: selectedPedido.id,
          nome: selectedPedido.veiculoNome,
          valor: selectedPedido.valorTotal,
          decisao,
          atualizadoEm: new Date().toISOString(),
        },
        ...current,
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível concluir a análise do pedido.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const stats = [
    {
      title: 'AGUARDANDO ANÁLISE',
      value: pendingPedidos.length,
      valueClass: 'text-[#D98704]',
      icon: <Landmark className="h-7 w-7 text-[#E09106]" strokeWidth={2.2} />,
    },
    {
      title: 'APROVADOS',
      value: aprovados,
      valueClass: 'text-[#157A4E]',
      icon: <CheckCircle2 className="h-7 w-7 text-[#157A4E]" strokeWidth={2.2} />,
    },
    {
      title: 'REPROVADOS',
      value: reprovados,
      valueClass: 'text-[#E02E2E]',
      icon: <XCircle className="h-7 w-7 text-[#E02E2E]" strokeWidth={2.2} />,
    },
  ]

  const sidePanel = mode === 'financeiro' ? (
    selectedPedido ? (
      <article className="rounded-2xl bg-surface p-5 shadow-[0_14px_28px_rgba(16,19,31,0.04)]">
        <h3 className="text-[30px] leading-none text-text-primary md:text-[34px]" style={{ fontFamily: 'var(--font-dm-serif)' }}>
          Análise de Financiamento
        </h3>

        <div className="mt-5 overflow-hidden rounded-xl bg-surface-2">
          <div className="relative h-44 w-full">
            <Image
              src={selectedPedido.imagemUrl}
              alt={selectedPedido.veiculoNome}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 420px"
            />
          </div>
        </div>

        <dl className="mt-5 space-y-2.5 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">Veículo</dt>
            <dd className="font-semibold text-text-primary">{selectedPedido.veiculoNome}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">Placa</dt>
            <dd className="font-semibold text-text-primary">{selectedPedido.placa}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">Período</dt>
            <dd className="font-semibold text-text-primary">{selectedPedido.periodoLabel}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">Locador</dt>
            <dd className="font-semibold text-text-primary">{selectedPedido.locadorNome}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">Data do Pedido</dt>
            <dd className="font-semibold text-text-primary">{selectedPedido.dataPedidoLabel}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">Valor Total</dt>
            <dd className="text-2xl text-accent md:text-3xl" style={{ fontFamily: 'var(--font-dm-serif)' }}>
              {formatCurrency(selectedPedido.valorTotal)}
            </dd>
          </div>
        </dl>

        <div className="my-4 h-px bg-border" />

        <h4 className="text-base font-semibold text-text-primary">Dados do Cliente</h4>
        <dl className="mt-2.5 space-y-2.5 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">Nome</dt>
            <dd className="font-semibold text-text-primary">{selectedPedido.clienteNome}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">CPF</dt>
            <dd className="font-semibold text-text-primary">{formatCpf(selectedPedido.clienteCpf)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">Profissão</dt>
            <dd className="font-semibold text-text-primary">{selectedPedido.clienteProfissao}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">Rendimento</dt>
            <dd className="font-semibold text-text-primary">{formatCurrency(selectedPedido.clienteRendimento)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">Endereço</dt>
            <dd className="text-right font-semibold text-text-primary">{selectedPedido.clienteEndereco}</dd>
          </div>
        </dl>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => void handleDecision('APROVADO')}
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center rounded-lg bg-[#157A4E] px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            Aprovar
          </button>
          <button
            onClick={() => void handleDecision('REPROVADO')}
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center rounded-lg border border-[#E7B7B7] bg-white px-4 text-sm font-semibold text-[#E02E2E] transition hover:bg-[#FFF1F1] disabled:opacity-60"
          >
            Reprovar
          </button>
        </div>
      </article>
    ) : (
      <article className="rounded-2xl bg-surface px-6 py-10 text-center">
        <Eye className="mx-auto h-11 w-11 text-text-disabled" />
        <p className="mt-5 text-xl leading-tight text-text-secondary md:text-2xl" style={{ fontFamily: 'var(--font-dm-sans)' }}>
          Selecione um pedido para analisar
        </p>
      </article>
    )
  ) : (
    selectedPedido ? (
      <article className="rounded-2xl bg-surface p-5 shadow-[0_14px_28px_rgba(16,19,31,0.04)]">
        <h3 className="text-[30px] leading-none text-text-primary md:text-[34px]" style={{ fontFamily: 'var(--font-dm-serif)' }}>
          Análise do Banco
        </h3>

        <div className="mt-5 overflow-hidden rounded-xl bg-surface-2">
          <div className="relative h-44 w-full">
            <Image
              src={selectedPedido.imagemUrl}
              alt={selectedPedido.veiculoNome}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 420px"
            />
          </div>
        </div>

        <dl className="mt-5 space-y-2.5 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">Veículo</dt>
            <dd className="font-semibold text-text-primary">{selectedPedido.veiculoNome}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">Placa</dt>
            <dd className="font-semibold text-text-primary">{selectedPedido.placa}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">Período</dt>
            <dd className="font-semibold text-text-primary">{selectedPedido.periodoLabel}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">Locador</dt>
            <dd className="font-semibold text-text-primary">{selectedPedido.locadorNome}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">Valor Total</dt>
            <dd className="text-2xl text-accent md:text-3xl" style={{ fontFamily: 'var(--font-dm-serif)' }}>
              {formatCurrency(selectedPedido.valorTotal)}
            </dd>
          </div>
        </dl>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => void handleDecision('APROVADO')}
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center rounded-lg bg-[#157A4E] px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            Aprovar
          </button>
          <button
            onClick={() => void handleDecision('REPROVADO')}
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center rounded-lg border border-[#E7B7B7] bg-white px-4 text-sm font-semibold text-[#E02E2E] transition hover:bg-[#FFF1F1] disabled:opacity-60"
          >
            Reprovar
          </button>
        </div>
      </article>
    ) : (
      <article className="rounded-2xl bg-surface px-6 py-10 text-center">
        <Eye className="mx-auto h-11 w-11 text-text-disabled" />
        <p className="mt-5 text-xl leading-tight text-text-secondary md:text-2xl" style={{ fontFamily: 'var(--font-dm-sans)' }}>
          Selecione um pedido para analisar
        </p>
      </article>
    )
  )

  return (
    <div className="min-h-screen bg-page">
      <main className="mx-auto max-w-[1280px] px-6 pb-14 pt-10 sm:px-8 lg:px-12 lg:pb-16 lg:pt-12">
        <div className="space-y-8">
          <header className="space-y-3">
            <h1
              className="text-[clamp(3rem,4.3vw,4rem)] leading-[0.98] text-text-primary"
              style={{ fontFamily: 'var(--font-dm-serif)' }}
            >
              {heading}
            </h1>
            <p className="ds-body-lg text-text-secondary">{subtitle}</p>
          </header>

          <section className="grid gap-4 md:grid-cols-3 lg:gap-5">
            {stats.map((item) => (
              <article key={item.title} className="rounded-2xl bg-surface px-5 py-6 lg:px-6 lg:py-7">
                <div className="flex items-center gap-4 lg:gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-surface-2 lg:h-20 lg:w-20">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.08em] text-[#59627A] sm:text-sm">{item.title}</p>
                    <p className={cn('mt-1 text-4xl leading-none sm:text-5xl', item.valueClass)} style={{ fontFamily: 'var(--font-dm-serif)' }}>
                      {item.value}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </section>

          {error && (
            <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
            <section>
              <h2 className="text-4xl leading-tight text-text-primary sm:text-5xl" style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 700 }}>
                {mode === 'financeiro' ? 'Pedidos do Locador' : 'Pedidos para Financiamento'}
              </h2>

              {loading ? (
                <div className="mt-4 rounded-2xl bg-surface px-6 py-8 text-text-secondary">Carregando pedidos...</div>
              ) : pendingPedidos.length === 0 ? (
                <div className="mt-4 rounded-2xl bg-surface px-6 py-8 text-text-secondary">Nenhum pedido pendente no momento.</div>
              ) : (
                <div className="mt-4 space-y-3.5">
                  {pendingPedidos.map((pedido) => {
                    return (
                      <button
                        key={pedido.id}
                        onClick={() => setSelectedId(pedido.id)}
                        className={cn(
                          'flex w-full items-center justify-between gap-4 rounded-2xl border bg-surface px-4 py-4 text-left transition lg:px-5 lg:py-5',
                          selectedId === pedido.id
                            ? 'border-[#4B82D8] shadow-[0_0_0_1px_rgba(75,130,216,0.30)]'
                            : 'border-transparent hover:border-border-strong'
                        )}
                      >
                        <div className="flex min-w-0 items-center gap-4 lg:gap-5">
                          <div className="relative h-[66px] w-[96px] shrink-0 overflow-hidden rounded-xl bg-surface-2">
                            <Image
                              src={pedido.imagemUrl}
                              alt={pedido.veiculoNome}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-lg leading-tight text-text-primary sm:text-xl" style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 700 }}>
                              {pedido.veiculoNome}
                            </p>
                            <p className="mt-1 text-base text-text-secondary sm:text-lg">{pedido.periodoLabel}</p>
                          </div>
                        </div>

                        <p className="shrink-0 text-3xl leading-none text-accent sm:text-4xl" style={{ fontFamily: 'var(--font-dm-serif)' }}>
                          {formatCurrency(pedido.valorTotal)}
                        </p>
                      </button>
                    )
                  })}
                </div>
              )}
            </section>

            <div className="hidden xl:block">{sidePanel}</div>
          </div>

          <section className="space-y-4">
            <h2 className="text-4xl leading-tight text-text-primary sm:text-5xl" style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 700 }}>
              Histórico
            </h2>

            {historico.length > 0 && (
              <div className="space-y-2.5">
                {historico.map((item) => (
                  <article key={`${item.id}-${item.decisao}-${item.atualizadoEm}`} className="rounded-xl border border-border bg-surface px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-text-primary">{item.nome}</p>
                      <span
                        className={cn(
                          'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                          item.decisao === 'APROVADO'
                            ? 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300'
                        )}
                      >
                        {item.decisao}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-text-secondary">{formatCurrency(item.valor)}</p>
                  </article>
                ))}
              </div>
            )}

            <div className="xl:hidden">{sidePanel}</div>
          </section>
        </div>
      </main>
    </div>
  )
}
