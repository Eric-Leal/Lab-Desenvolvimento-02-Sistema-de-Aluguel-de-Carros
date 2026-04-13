import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { PedidoDetailLoader } from "@/components/pedidos/PedidoDetailClient"

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ novo?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  return {
    title: `Pedido ${id.slice(0, 8).toUpperCase()} — CarFlow`,
  }
}

export default async function PedidoDetailPage({ params, searchParams }: Props) {
  const { id } = await params
  const { novo } = await searchParams

  return (
    <div className="min-h-screen bg-page">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(26,77,168,0.08) 0%, rgba(56,122,222,0.04) 40%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 py-10 lg:px-10">
          <Link
            href="/veiculos"
            className="mb-4 inline-flex items-center gap-1.5 ds-body text-text-secondary transition-colors hover:text-text-primary"
          >
            <ChevronLeft size={16} />
            Ver Veículos
          </Link>
          <h1
            className="text-3xl text-text-primary lg:text-4xl"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Detalhes do Pedido
          </h1>
          <p className="mt-1 ds-body text-text-secondary font-mono">
            #{id.toUpperCase()}
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-6 py-10 lg:px-10 lg:py-14">
        <PedidoDetailLoader pedidoId={id} isNew={novo === "true"} />
      </main>
    </div>
  )
}
