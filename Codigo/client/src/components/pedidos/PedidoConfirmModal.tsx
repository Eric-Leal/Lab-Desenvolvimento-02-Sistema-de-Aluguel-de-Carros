"use client"

import { AlertTriangle, Loader2 } from "lucide-react"

interface PedidoConfirmModalProps {
  open: boolean
  title: string
  description: string
  confirmText: string
  tone?: "danger" | "warning"
  loading?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function PedidoConfirmModal({
  open,
  title,
  description,
  confirmText,
  tone = "danger",
  loading = false,
  onClose,
  onConfirm,
}: PedidoConfirmModalProps) {
  if (!open) return null

  const toneClass = tone === "danger"
    ? "border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
    : "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"

  const confirmBtnClass = tone === "danger"
    ? "bg-red-600 hover:bg-red-700"
    : "bg-amber-600 hover:bg-amber-700"

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-xl bg-surface p-5 shadow-[0_20px_60px_rgba(16,19,31,0.28)]">
        <div className={`flex items-start gap-3 rounded-lg border p-3 ${toneClass}`}>
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">{title}</p>
            <p className="mt-1 text-sm">{description}</p>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-medium text-text-primary transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
          >
            Voltar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${confirmBtnClass}`}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                Processando...
              </span>
            ) : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
