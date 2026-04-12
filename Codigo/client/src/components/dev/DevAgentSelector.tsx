"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, LogOut, ShieldUser } from "lucide-react"
import { SEED_AGENTS, useDevAgentSession } from "@/store/use-dev-agent-session"

export function DevAgentSelector() {
  const { currentAgent, setCurrentAgent } = useDevAgentSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div className="sticky top-0 z-100 border-b border-blue-300/40 bg-blue-50/95 px-4 py-2 backdrop-blur-sm dark:border-blue-800/40 dark:bg-blue-950/50">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-blue-500 text-[10px] font-bold text-white">
            DEV
          </span>
          <span className="ds-caption font-medium text-blue-800 dark:text-blue-300">
            Modo locador — selecione um agente para gerenciar veículos
          </span>
        </div>

        <div className="relative" ref={ref}>
          {currentAgent ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-sm font-medium text-blue-900 transition hover:bg-blue-50 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-200"
              >
                <ShieldUser size={14} />
                {currentAgent.nome}
                <ChevronDown size={14} />
              </button>
              <button
                onClick={() => setCurrentAgent(null)}
                className="rounded-lg border border-blue-300 bg-white p-1.5 text-blue-700 transition hover:bg-blue-50 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                title="Sair"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg border border-blue-500 bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              <ShieldUser size={14} />
              Selecionar locador
              <ChevronDown size={14} />
            </button>
          )}

          {open && (
            <div className="absolute right-0 top-full z-50 mt-1 w-72 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
              <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Agentes locadores
              </p>
              {SEED_AGENTS.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => {
                    setCurrentAgent(agent)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center justify-between px-4 py-3 text-sm transition hover:bg-surface-2 ${
                    currentAgent?.id === agent.id ? "bg-primary-soft" : ""
                  }`}
                >
                  <span className="font-medium text-text-primary">{agent.nome}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
