'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import { contratoService } from '@/services/contrato.service'
import { rentalsService } from '@/services/rentals.service'
import { reservasService } from '@/services/reservas.service'
import { usersService } from '@/services/users.service'
import { vehiclesService } from '@/services/vehicles.service'

type ServiceCard = {
  key: string
  label: string
  porta: number
  descricao: string
  marcador: string
  ping: () => Promise<string>
}

const services: ServiceCard[] = [
  {
    key: 'users',
    label: 'usersService',
    porta: 8080,
    descricao: 'Cadastro, autenticação e perfis de usuários.',
    marcador: 'var(--primary)',
    ping: usersService.ping,
  },
  {
    key: 'vehicles',
    label: 'vehiclesService',
    porta: 8081,
    descricao: 'Catálogo, atributos e disponibilidade dos veículos.',
    marcador: 'var(--status-success-fg)',
    ping: vehiclesService.ping,
  },
  {
    key: 'rentals',
    label: 'rentalsService',
    porta: 8082,
    descricao: 'Fluxo central de aluguel e acompanhamento do pedido.',
    marcador: 'var(--accent-default)',
    ping: rentalsService.ping,
  },
  {
    key: 'contrato',
    label: 'contratoService',
    porta: 8083,
    descricao: 'Emissão, análise e fechamento contratual.',
    marcador: '#6f56d9',
    ping: contratoService.ping,
  },
  {
    key: 'reservas',
    label: 'reservasService',
    porta: 8084,
    descricao: 'Reserva, confirmação e controle de janelas.',
    marcador: '#d95f8b',
    ping: reservasService.ping,
  },
]

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Falha inesperada ao consultar o serviço.'
}

export default function Home() {
  const [loadingKey, setLoadingKey] = useState<string | null>(null)
  const [statusMap, setStatusMap] = useState<Record<string, string>>({})

  const handlePing = async (service: ServiceCard) => {
    setLoadingKey(service.key)

    try {
      const response = await service.ping()
      setStatusMap((current) => ({
        ...current,
        [service.key]: `Sucesso: ${response}`,
      }))
    } catch (error) {
      setStatusMap((current) => ({
        ...current,
        [service.key]: `Erro: ${getErrorMessage(error)}`,
      }))
    } finally {
      setLoadingKey(null)
    }
  }

  return (
    <main className="flex-1 py-8 sm:py-10 lg:py-14">
      <div className="ds-shell space-y-8 lg:space-y-12">
        <section className="ds-panel overflow-hidden px-6 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-5">
              <p className="ds-kicker">Sistema de aluguel de carros</p>
              <h1 className="ds-display max-w-4xl text-text-primary">
                Painel editorial para observar o ecossistema de microsserviços.
              </h1>
              <p className="ds-body-lg max-w-2xl">
                A base de interface agora usa tokens semânticos, tipografia DM Sans e DM Serif Display,
                além de suporte consistente a light e dark mode para todo o client.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
              <AnimatedThemeToggler />
              <Link
                href="/design"
                className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-4 py-3 text-sm font-medium text-text-primary transition hover:bg-primary-soft"
              >
                Consultar design system
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-surface p-5">
              <p className="ds-label text-text-brand">Gateway</p>
              <p className="mt-3 ds-h3 text-text-primary">http://localhost:8000</p>
              <p className="mt-2 ds-body">Ponto central para rotear as chamadas dos serviços internos.</p>
            </div>

            <div className="rounded-lg bg-surface p-5">
              <p className="ds-label text-text-brand">Modo visual</p>
              <p className="mt-3 ds-h3 text-text-primary">Light e dark com os mesmos tokens</p>
              <p className="mt-2 ds-body">Cores, tipografia e estados interativos agora partem da mesma fonte semântica.</p>
            </div>

            <div className="rounded-lg bg-surface p-5">
              <p className="ds-label text-text-brand">Pre-commit</p>
              <p className="mt-3 ds-h3 text-text-primary">Lint e formatação automáticos</p>
              <p className="mt-2 ds-body">O hook impede commits com problemas simples que apareceriam no build.</p>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="ds-kicker">Diagnóstico operacional</p>
              <h2 className="ds-h2 mt-2 text-text-primary">Verificação rápida dos serviços</h2>
            </div>
            <p className="max-w-xl ds-body">
              Cada card usa a mesma lógica visual do design system: superfície tonal, tipografia editorial
              e feedback de status consistente.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => {
              const status = statusMap[service.key]
              const hasError = status?.startsWith('Erro')
              const isLoading = loadingKey === service.key

              return (
                <article key={service.key} className="ds-card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: service.marcador }}
                          aria-hidden="true"
                        />
                        <p className="ds-h4 text-text-primary">{service.label}</p>
                      </div>
                      <p className="mt-2 ds-caption">Porta {service.porta}</p>
                    </div>

                    <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-text-brand">
                      online check
                    </span>
                  </div>

                  <p className="mt-5 ds-body">{service.descricao}</p>

                  <button
                    onClick={() => handlePing(service)}
                    disabled={Boolean(loadingKey)}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-interactive-hover active:bg-interactive-press disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? 'Consultando...' : 'Testar conexão'}
                  </button>

                  <div
                    className={`mt-4 rounded-md px-4 py-3 text-sm ${
                      status
                        ? hasError
                          ? 'bg-danger-soft text-danger'
                          : 'bg-success-soft text-success'
                        : 'bg-surface-2 text-text-secondary'
                    }`}
                  >
                    {status ?? 'Nenhum teste executado para este serviço ainda.'}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}
