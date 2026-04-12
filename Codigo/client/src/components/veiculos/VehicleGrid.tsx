"use client"

import { useState, useMemo } from "react"
import type { Automovel } from "@/types/vehicle"
import { VehicleCard } from "@/components/veiculos/VehicleCard"
import { VehicleFilters } from "@/components/veiculos/VehicleFilters"

type FilterTab = "todos" | "disponiveis"

interface VehicleGridProps {
  vehicles: Automovel[]
  locadoresMap?: Record<string, string>
}

export function VehicleGrid({ vehicles, locadoresMap = {} }: VehicleGridProps) {
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState<FilterTab>("todos")

  const filtered = useMemo(() => {
    let result = vehicles

    if (activeFilter === "disponiveis") {
      result = result.filter((v) => v.disponivel)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (v) =>
          v.marca.toLowerCase().includes(q) ||
          v.modelo.toLowerCase().includes(q) ||
          v.placa.toLowerCase().includes(q)
      )
    }

    return result
  }, [vehicles, search, activeFilter])

  return (
    <div className="space-y-8">
      <VehicleFilters
        search={search}
        activeFilter={activeFilter}
        onSearchChange={setSearch}
        onFilterChange={setActiveFilter}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 rounded-full bg-surface-2 p-6">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-text-disabled"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <p className="ds-h4 text-text-primary">Nenhum veículo encontrado</p>
          <p className="ds-body mt-1">Tente ajustar os filtros ou a busca</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((vehicle) => (
            <VehicleCard
              key={vehicle.matricula}
              vehicle={vehicle}
              locadorNome={locadoresMap[vehicle.locadorOriginalId]}
            />
          ))}
        </div>
      )}
    </div>
  )
}
