"use client"

import { AlertTriangle, Loader2 } from "lucide-react"

interface VehicleDeleteModalProps {
  open: boolean
  vehicleName: string
  loading?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function VehicleDeleteModal({ open, vehicleName, loading = false, onClose, onConfirm }: VehicleDeleteModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-xl bg-surface p-5 shadow-[0_20px_60px_rgba(16,19,31,0.28)]">
        <div className="flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 p-3 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Confirmar exclusão</p>
            <p className="mt-1 text-sm">Deseja excluir o veículo {vehicleName}? Esta ação é permanente.</p>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button onClick={onClose} disabled={loading} className="flex-1 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-medium text-text-primary transition hover:bg-surface disabled:opacity-60">
            Voltar
          </button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60">
            {loading ? (
              <span className="inline-flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Excluindo...</span>
            ) : "Excluir veículo"}
          </button>
        </div>
      </div>
    </div>
  )
}
