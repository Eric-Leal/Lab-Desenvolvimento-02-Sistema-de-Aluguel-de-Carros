"use client"

/**
 * DEV SESSION STORE
 * Substituto temporário de autenticação para desenvolvimento.
 * Persiste no localStorage o cliente selecionado para testar o fluxo de aluguel.
 * REMOVER / substituir quando o fluxo de autenticação real for implementado.
 */

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface DevClient {
  id: string
  nome: string
  rendimentoTotal: number
}

// Clientes da seed — mesmos IDs e rendimentos do seed.sql
export const SEED_CLIENTS: DevClient[] = [
  { id: "c1000000-0000-0000-0000-000000000001", nome: "Maria Silva", rendimentoTotal: 8500 },
  { id: "c1000000-0000-0000-0000-000000000002", nome: "Carlos Pereira", rendimentoTotal: 6000 },
  { id: "c1000000-0000-0000-0000-000000000003", nome: "Ana Oliveira", rendimentoTotal: 15000 },
]

interface DevSessionState {
  currentClient: DevClient | null
  setCurrentClient: (client: DevClient | null) => void
}

export const useDevSession = create<DevSessionState>()(
  persist(
    (set) => ({
      currentClient: null,
      setCurrentClient: (client) => set({ currentClient: client }),
    }),
    {
      name: "carflow-dev-session",
    }
  )
)
