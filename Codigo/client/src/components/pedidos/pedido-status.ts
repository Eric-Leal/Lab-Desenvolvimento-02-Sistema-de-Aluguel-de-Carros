export type PedidoAction = "edit" | "submit" | "cancel" | "delete"

export function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    RASCUNHO: "Rascunho",
    SUBMETIDO: "Submetido",
    PENDENTE: "Pendente",
    APROVADO: "Aprovado",
    REPROVADO: "Reprovado",
    EM_ANALISE_BANCO: "Em Análise no Banco",
    CONTRATO_FECHADO: "Contrato Fechado",
    REPROVADO_BANCO: "Reprovado no Banco",
    CANCELADO: "Cancelado",
    CONCLUIDO: "Concluído",
  }
  return labels[status] ?? status
}

export function getStatusClassName(status: string) {
  const map: Record<string, string> = {
    RASCUNHO: "text-text-secondary bg-surface-2 border-border",
    SUBMETIDO: "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950/40 dark:border-blue-800",
    PENDENTE: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/40 dark:border-amber-800",
    APROVADO: "text-blue-900 bg-blue-100 border-blue-200 dark:text-blue-300 dark:bg-blue-950/40 dark:border-blue-800",
    REPROVADO: "text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/40 dark:border-red-800",
    EM_ANALISE_BANCO: "text-amber-800 bg-amber-100 border-amber-200 dark:text-amber-300 dark:bg-amber-950/50 dark:border-amber-800",
    CONTRATO_FECHADO: "text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/40 dark:border-green-800",
    REPROVADO_BANCO: "text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/40 dark:border-red-800",
    CANCELADO: "text-text-secondary bg-surface-2 border-border",
    CONCLUIDO: "text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/40 dark:border-green-800",
  }
  return map[status] ?? "text-text-secondary bg-surface-2 border-border"
}

export function getAllowedActions(status: string): PedidoAction[] {
  if (status === "RASCUNHO") return ["edit", "submit", "delete"]
  if (status === "SUBMETIDO") return ["cancel"]
  return []
}
