import { FinanciamentoDashboardClient } from '@/components/dashboard/FinanciamentoDashboardClient'

export const metadata = {
  title: 'Dashboard do Banco — CarFlow',
  description: 'Análise de pedidos de financiamento para aprovação bancária.',
}

export default function DashboardBancoPage() {
  return (
    <FinanciamentoDashboardClient
      mode="banco"
      heading="Dashboard do Banco"
      subtitle="Análise de pedidos de financiamento"
    />
  )
}
