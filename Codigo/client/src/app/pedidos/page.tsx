import { Navbar } from "@/components/navbar/NavbarV1"
import { DevClientSelector } from "@/components/dev/DevClientSelector"
import { MeusPedidosClient } from "@/components/pedidos/MeusPedidosClient"

export const metadata = {
  title: "Meus Pedidos — CarFlow",
  description: "Gerencie seus pedidos de aluguel: rascunhos, submissões, cancelamentos e status.",
}

export default function MeusPedidosPage() {
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
            Meus Pedidos
          </h1>
          <p className="mt-3 ds-body-lg max-w-2xl text-text-secondary">
            Acompanhe cada etapa do seu pedido, edite rascunhos, envie para análise e controle o status completo da locação.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-12">
        <MeusPedidosClient />
      </main>
    </div>
  )
}
