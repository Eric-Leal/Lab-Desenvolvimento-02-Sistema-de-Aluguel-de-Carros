import { FinanciamentoDashboardClient } from '@/components/dashboard/FinanciamentoDashboardClient'

export const metadata = {
  title: 'Dashboard do Financeiro — CarFlow',
  description: 'Painel de análise detalhada para decisão financeira dos pedidos.',
}

export default function DashboardFinanceiroPage() {
  return (
    <FinanciamentoDashboardClient
      mode="financeiro"
      heading="Dashboard do Financeiro"
      subtitle="Análise de pedidos de financiamento"
    />
  )
}
