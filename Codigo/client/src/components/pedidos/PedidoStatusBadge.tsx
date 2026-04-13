import { getStatusClassName, getStatusLabel } from "@/components/pedidos/pedido-status"

interface PedidoStatusBadgeProps {
  status: string
}

export function PedidoStatusBadge({ status }: PedidoStatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClassName(status)}`}>
      {getStatusLabel(status)}
    </span>
  )
}
