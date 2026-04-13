"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Car, Loader2, Pencil, Plus, SearchX, Trash2 } from "lucide-react"
import type { Automovel } from "@/types/vehicle"
import { vehiclesService } from "@/services/vehicles.service"
import { usersService } from "@/services/users.service"
import { useAuth } from "@/components/providers/auth-provider"
import { useAuthUserId } from "@/hooks/use-auth-user-id"
import { VehicleFormModal } from "@/components/veiculos/gestao/VehicleFormModal"
import { VehicleDeleteModal } from "@/components/veiculos/gestao/VehicleDeleteModal"

export function VehicleManagementClient() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const isAgent = user?.role === "AGENT"
  const currentAgentId = useAuthUserId()
  const [currentAgentName, setCurrentAgentName] = useState("")

  const [vehicles, setVehicles] = useState<Automovel[]>([])
  const [loading, setLoading] = useState(true)
  const [busyMatricula, setBusyMatricula] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [selectedVehicle, setSelectedVehicle] = useState<Automovel | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Automovel | null>(null)

  const loadVehicles = useCallback(async () => {
    if (!currentAgentId || !isAgent) {
      setVehicles([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const [agent, data] = await Promise.all([
        usersService.buscarAgent(currentAgentId).catch(() => null),
        vehiclesService.listarMeus(currentAgentId),
      ])
      setCurrentAgentName(agent?.nome ?? "Locador")
      const ordered = data.slice().sort((a, b) => b.matricula - a.matricula)
      setVehicles(ordered)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar veículos")
    } finally {
      setLoading(false)
    }
  }, [currentAgentId, isAgent])

  useEffect(() => {
    void loadVehicles()
  }, [loadVehicles])

  const resumo = useMemo(() => {
    const total = vehicles.length
    const disponiveis = vehicles.filter((v) => v.disponivel).length
    const indisponiveis = total - disponiveis
    const ticketMedio = total > 0
      ? vehicles.reduce((sum, v) => sum + Number(v.valorDiaria), 0) / total
      : 0
    return { total, disponiveis, indisponiveis, ticketMedio }
  }, [vehicles])

  function openCreate() {
    setFormMode("create")
    setSelectedVehicle(null)
    setFormOpen(true)
  }

  function openEdit(vehicle: Automovel) {
    setFormMode("edit")
    setSelectedVehicle(vehicle)
    setFormOpen(true)
  }

  function askDelete(vehicle: Automovel) {
    setDeleteTarget(vehicle)
    setDeleteOpen(true)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setBusyMatricula(deleteTarget.matricula)
    setError(null)
    try {
      await vehiclesService.excluir(deleteTarget.matricula)
      setDeleteOpen(false)
      setDeleteTarget(null)
      await loadVehicles()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir veículo")
    } finally {
      setBusyMatricula(null)
    }
  }

  if (authLoading) {
    return null
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-blue-300/60 bg-blue-50 p-5 text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
        <p className="font-semibold">Faça login para acessar a gestão de veículos.</p>
        <Link href="/login" className="mt-3 inline-flex rounded-md border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-800">
          Ir para login
        </Link>
      </div>
    )
  }

  if (!isAgent) {
    return (
      <div className="rounded-xl border border-blue-300/60 bg-blue-50 p-5 text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
        <p className="font-semibold">A gestão de veículos é exclusiva para contas de locador.</p>
        <p className="mt-1 text-sm">Sua conta atual não possui esse tipo de acesso.</p>
      </div>
    )
  }

  if (!currentAgentId) {
    return null
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl bg-surface p-4">
          <p className="ds-caption uppercase tracking-wider text-text-secondary">Total de veículos</p>
          <p className="mt-1 text-3xl text-text-primary" style={{ fontFamily: "var(--font-dm-serif)" }}>{resumo.total}</p>
        </article>
        <article className="rounded-xl bg-surface p-4">
          <p className="ds-caption uppercase tracking-wider text-text-secondary">Disponíveis</p>
          <p className="mt-1 text-3xl text-green-700 dark:text-green-400" style={{ fontFamily: "var(--font-dm-serif)" }}>{resumo.disponiveis}</p>
        </article>
        <article className="rounded-xl bg-surface p-4">
          <p className="ds-caption uppercase tracking-wider text-text-secondary">Indisponíveis</p>
          <p className="mt-1 text-3xl text-amber-700 dark:text-amber-400" style={{ fontFamily: "var(--font-dm-serif)" }}>{resumo.indisponiveis}</p>
        </article>
        <article className="rounded-xl bg-surface p-4">
          <p className="ds-caption uppercase tracking-wider text-text-secondary">Diária média</p>
          <p className="mt-1 text-3xl text-accent" style={{ fontFamily: "var(--font-dm-serif)" }}>R$ {resumo.ticketMedio.toFixed(0)}</p>
        </article>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface p-4">
        <div>
          <p className="text-lg font-semibold text-text-primary">{currentAgentName}</p>
          <p className="text-md">Gerencie sua frota, valores e disponibilidade.</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800">
          <Plus size={16} /> Cadastrar novo veículo
        </button>
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
      ) : vehicles.length === 0 ? (
        <div className="rounded-xl bg-surface px-6 py-16 text-center">
          <SearchX size={28} className="mx-auto text-text-secondary" />
          <p className="mt-3 text-lg font-semibold text-text-primary">Nenhum veículo cadastrado</p>
          <p className="mt-1 ds-body text-text-secondary">Cadastre seu primeiro veículo para começar a locação.</p>
        </div>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => {
            const image = vehicle.imagens?.slice().sort((a, b) => a.ordem - b.ordem)[0]
            return (
              <article key={vehicle.matricula} className="overflow-hidden rounded-xl border border-border bg-surface">
                <div className="relative h-48 bg-surface-2">
                  {image ? (
                    <Image
                      src={image.imageUrl}
                      alt={`${vehicle.marca} ${vehicle.modelo}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1280px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Car size={30} className="text-text-secondary" />
                    </div>
                  )}
                  <div className="absolute right-3 top-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${vehicle.disponivel
                      ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                    }`}>
                      {vehicle.disponivel ? "Disponível" : "Indisponível"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 p-4">
                  <div>
                    <p className="ds-caption uppercase tracking-widest text-text-secondary">{vehicle.marca}</p>
                    <h3 className="text-2xl text-text-primary" style={{ fontFamily: "var(--font-dm-serif)" }}>{vehicle.modelo}</h3>
                    <p className="mt-1 ds-body">Placa {vehicle.placa} • Ano {vehicle.ano}</p>
                    <p className="mt-2 text-2xl text-accent" style={{ fontFamily: "var(--font-dm-serif)" }}>R$ {Number(vehicle.valorDiaria).toFixed(2)}/dia</p>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => openEdit(vehicle)} className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-surface">
                      <Pencil size={14} /> Editar
                    </button>
                    <button
                      onClick={() => askDelete(vehicle)}
                      disabled={busyMatricula === vehicle.matricula || !vehicle.disponivel}
                      title={!vehicle.disponivel ? "Veículo em locação não pode ser excluído" : "Excluir veículo"}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
                    >
                      <Trash2 size={14} /> Excluir
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      )}

      <VehicleFormModal
        open={formOpen}
        mode={formMode}
        vehicle={selectedVehicle}
        locadorId={currentAgentId}
        onClose={() => setFormOpen(false)}
        onSaved={loadVehicles}
      />

      <VehicleDeleteModal
        open={deleteOpen}
        vehicleName={deleteTarget ? `${deleteTarget.marca} ${deleteTarget.modelo}` : "veículo selecionado"}
        loading={busyMatricula != null}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
