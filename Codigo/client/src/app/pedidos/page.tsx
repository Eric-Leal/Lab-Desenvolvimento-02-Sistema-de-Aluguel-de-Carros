import Link from "next/link"
import { Navbar } from "@/components/navbar/NavbarV1"
import { DevClientSelector } from "@/components/dev/DevClientSelector"
import { MeusPedidosClient } from "@/components/pedidos/MeusPedidosClient"
import { HistoricoLocacoesClient } from "@/components/pedidos/HistoricoLocacoesClient"

export const metadata = {
  title: "Meus Pedidos — CarFlow",
  description: "Gerencie seus pedidos de aluguel: rascunhos, submissões, cancelamentos e status.",
}

interface Props {
  searchParams: Promise<{ tab?: string }>
}

export default async function MeusPedidosPage({ searchParams }: Props) {
  const { tab } = await searchParams
  const activeTab = tab === "historico" ? "historico" : "pedidos"

  return (
    <div className="min-h-screen bg-page">
      <DevClientSelector />
      <Navbar />

      <div className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(26,77,168,0.10) 0%, rgba(56,122,222,0.06) 45%, transparent 75%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-14">
          <p className="ds-caption font-semibold uppercase tracking-widest text-text-brand">
            Painel do Cliente
          </p>
          <h1 className="mt-2 text-4xl text-text-primary lg:text-5xl" style={{ fontFamily: "var(--font-dm-serif)" }}>
            {activeTab === "pedidos" ? "Meus Pedidos" : "Histórico de Locações"}
          </h1>
          <p className="mt-3 ds-body-lg max-w-2xl text-text-secondary">
            {activeTab === "pedidos"
              ? "Gerencie suas solicitações de aluguel"
              : "Contratos de locação realizados"}
          </p>

          <div className="mt-6 inline-flex rounded-full bg-surface p-1.5 shadow-[0_2px_14px_rgba(26,77,168,0.08)]">
            <Link
              href="/pedidos"
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${activeTab === "pedidos"
                ? "bg-(--primary-700) text-white"
                : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Meus Pedidos
            </Link>
            <Link
              href="/pedidos?tab=historico"
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${activeTab === "historico"
                ? "bg-(--primary-700) text-white"
                : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Histórico de Locações
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-12">
        {activeTab === "pedidos" ? <MeusPedidosClient /> : <HistoricoLocacoesClient />}
      </main>
    </div>
  )
}
