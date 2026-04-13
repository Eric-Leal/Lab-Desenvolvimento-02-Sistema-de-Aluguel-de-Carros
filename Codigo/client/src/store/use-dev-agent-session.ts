"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface DevAgent {
  id: string
  nome: string
}

export const SEED_AGENTS: DevAgent[] = [
  { id: "a1000000-0000-0000-0000-000000000001", nome: "AutoLocadora Elite" },
  { id: "a1000000-0000-0000-0000-000000000002", nome: "João Locador" },
]

interface DevAgentSessionState {
  currentAgent: DevAgent | null
  setCurrentAgent: (agent: DevAgent | null) => void
}

export const useDevAgentSession = create<DevAgentSessionState>()(
  persist(
    (set) => ({
      currentAgent: null,
      setCurrentAgent: (agent) => set({ currentAgent: agent }),
    }),
    {
      name: "carflow-dev-agent-session",
    }
  )
)
