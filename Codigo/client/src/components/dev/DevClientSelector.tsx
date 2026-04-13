"use client"

import { User, ChevronDown, LogOut } from "lucide-react"
import { useDevSession, SEED_CLIENTS } from "@/store/use-dev-session"
import { useState, useRef, useEffect } from "react"

/**
 * Seletor de cliente para ambiente de desenvolvimento.
 * Permite simular login como um dos 3 clientes da seed sem autenticação real.
 * Aparece como uma barra fixa no topo da tela (só em dev).
 */
export function DevClientSelector() {
  const { currentClient, setCurrentClient } = useDevSession()
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
    <div className="sticky top-0 z-100 border-b border-amber-300/40 bg-amber-50/95 px-4 py-2 backdrop-blur-sm dark:border-amber-700/30 dark:bg-amber-950/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-amber-400 text-[10px] font-bold text-amber-900">
            DEV
          </span>
          <span className="ds-caption font-medium text-amber-800 dark:text-amber-300">
            Modo desenvolvimento — selecione um cliente para simular sessão
          </span>
        </div>

        <div className="relative" ref={ref}>
          {currentClient ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-sm font-medium text-amber-900 transition hover:bg-amber-50 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-200 dark:hover:bg-amber-900/60"
              >
                <User size={14} />
                {currentClient.nome}
                <span className="ds-caption text-amber-600 dark:text-amber-400">
                  R$ {currentClient.rendimentoTotal.toLocaleString("pt-BR")}/mês
                </span>
                <ChevronDown size={14} />
              </button>
              <button
                onClick={() => setCurrentClient(null)}
                className="rounded-lg border border-amber-300 bg-white p-1.5 text-amber-700 transition hover:bg-amber-50 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                title="Sair"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg border border-amber-400 bg-amber-400 px-3 py-1.5 text-sm font-semibold text-amber-900 transition hover:bg-amber-500"
            >
              <User size={14} />
              Selecionar cliente
              <ChevronDown size={14} />
            </button>
          )}

          {open && (
            <div className="absolute right-0 top-full z-50 mt-1 w-72 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
              <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Clientes da seed
              </p>
              {SEED_CLIENTS.map((client) => (
                <button
                  key={client.id}
                  onClick={() => {
                    setCurrentClient(client)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center justify-between px-4 py-3 text-sm transition hover:bg-surface-2 ${
                    currentClient?.id === client.id ? "bg-primary-soft" : ""
                  }`}
                >
                  <span className="font-medium text-text-primary">{client.nome}</span>
                  <span className="ds-caption text-text-secondary">
                    R$ {client.rendimentoTotal.toLocaleString("pt-BR")}/mês
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
