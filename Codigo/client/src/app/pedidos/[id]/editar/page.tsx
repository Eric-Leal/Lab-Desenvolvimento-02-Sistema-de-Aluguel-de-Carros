import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Navbar } from "@/components/navbar/NavbarV1"
import { DevClientSelector } from "@/components/dev/DevClientSelector"
import { PedidoEditForm } from "@/components/pedidos/PedidoEditForm"
import { rentalsService } from "@/services/rentals.service"
import { vehiclesService } from "@/services/vehicles.service"
import { SEED_CLIENTS } from "@/store/use-dev-session"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  return {
    title: `Editar Pedido ${id.slice(0, 8).toUpperCase()} — CarFlow`,
  }
}

export default async function EditarPedidoPage({ params }: Props) {
  const { id } = await params

  let pedido
  try {
    pedido = await rentalsService.buscarPorId(id)
  } catch {
    notFound()
  }

  if (pedido.statusGeral !== "RASCUNHO") {
    redirect(`/pedidos/${id}`)
  }

  let vehicle
  try {
    vehicle = await vehiclesService.buscarPorMatricula(pedido.automovelMatricula)
  } catch {
    notFound()
  }

  const currentClient = SEED_CLIENTS.find((client) => client.id === pedido.clienteId)
  if (!currentClient) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-page">
      <DevClientSelector />
      <Navbar />

      <div className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(26,77,168,0.08) 0%, rgba(56,122,222,0.04) 40%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6 py-10 lg:px-10">
          <Link
            href={`/pedidos/${id}`}
            className="mb-4 inline-flex items-center gap-1.5 ds-body text-text-secondary transition-colors hover:text-text-primary"
          >
            <ChevronLeft size={16} />
            Voltar para detalhes
          </Link>
          <h1 className="text-3xl text-text-primary lg:text-4xl" style={{ fontFamily: "var(--font-dm-serif)" }}>
            Editar Pedido
          </h1>
          <p className="mt-1 ds-body text-text-secondary font-mono">#{id.toUpperCase()}</p>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-6 py-10 lg:px-10 lg:py-14">
        <PedidoEditForm pedido={pedido} vehicle={vehicle} currentClient={currentClient} />
      </main>
    </div>
  )
}
