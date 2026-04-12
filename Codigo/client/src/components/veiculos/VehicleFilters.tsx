"use client"

import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

type FilterTab = "todos" | "disponiveis"

interface VehicleFiltersProps {
  search: string
  activeFilter: FilterTab
  onSearchChange: (value: string) => void
  onFilterChange: (filter: FilterTab) => void
}

export function VehicleFilters({
  search,
  activeFilter,
  onSearchChange,
  onFilterChange,
}: VehicleFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled"
        />
        <input
          type="text"
          placeholder="Buscar por marca, modelo ou placa..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg bg-surface-2 py-3 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onFilterChange("disponiveis")}
          className={cn(
            "rounded-lg px-5 py-3 text-sm font-medium transition-colors",
            activeFilter === "disponiveis"
              ? "bg-(--primary-700) text-white"
              : "bg-surface-2 text-text-secondary hover:bg-surface hover:text-text-primary"
          )}
        >
          Disponíveis
        </button>
        <button
          onClick={() => onFilterChange("todos")}
          className={cn(
            "rounded-lg px-5 py-3 text-sm font-medium transition-colors",
            activeFilter === "todos"
              ? "bg-(--primary-700) text-white"
              : "bg-surface-2 text-text-secondary hover:bg-surface hover:text-text-primary"
          )}
        >
          Todos
        </button>
      </div>
    </div>
  )
}
