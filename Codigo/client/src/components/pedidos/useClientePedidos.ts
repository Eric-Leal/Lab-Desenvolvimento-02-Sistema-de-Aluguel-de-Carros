"use client"

import { useCallback, useEffect, useState } from "react"
import { useDevSession } from "@/store/use-dev-session"
import { rentalsService, type PedidoResponse } from "@/services/rentals.service"
import { vehiclesService } from "@/services/vehicles.service"
import type { Automovel } from "@/types/vehicle"

export function useClientePedidos() {
  const currentClient = useDevSession((state) => state.currentClient)

  const [pedidos, setPedidos] = useState<PedidoResponse[]>([])
  const [vehiclesMap, setVehiclesMap] = useState<Record<number, Automovel>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregarPedidos = useCallback(async () => {
    if (!currentClient) {
      setPedidos([])
      setVehiclesMap({})
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const pedidosCliente = await rentalsService.listarMeus(currentClient.id)
      const pedidosOrdenados = pedidosCliente.slice().sort((a, b) =>
        new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())

      setPedidos(pedidosOrdenados)

      const matriculas = Array.from(new Set(pedidosOrdenados.map((p) => p.automovelMatricula)))
      const vehicles = await Promise.all(
        matriculas.map(async (matricula) => {
          try {
            return await vehiclesService.buscarPorMatricula(matricula)
          } catch {
            return null
          }
        })
      )

      const map: Record<number, Automovel> = {}
      vehicles.forEach((vehicle) => {
        if (vehicle) map[vehicle.matricula] = vehicle
      })
      setVehiclesMap(map)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar pedidos")
    } finally {
      setLoading(false)
    }
  }, [currentClient])

  useEffect(() => {
    void carregarPedidos()
  }, [carregarPedidos])

  return {
    currentClient,
    pedidos,
    vehiclesMap,
    loading,
    error,
    setError,
    reload: carregarPedidos,
  }
}
