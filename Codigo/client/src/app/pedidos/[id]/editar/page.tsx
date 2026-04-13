import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Navbar } from "@/components/navbar/NavbarV1"
import { DevClientSelector } from "@/components/dev/DevClientSelector"
import { PedidoEditForm } from "@/components/pedidos/PedidoEditForm"
import { rentalsService } from "@/services/rentals.service"
import { usersService } from "@/services/users.service"
import { vehiclesService } from "@/services/vehicles.service"

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

  let currentClient: { id: string; nome: string; rendimentoTotal: number } | null = null
  let clientLoadError: string | null = null
  try {
    const client = await usersService.buscarClient(pedido.clienteId)
    currentClient = {
      id: client.id,
      nome: client.nome,
      rendimentoTotal: client.rendimentoTotal,
    }
  } catch {
    clientLoadError = "Não foi possível carregar os dados do cliente para editar este pedido agora."
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
        {currentClient ? (
          <PedidoEditForm pedido={pedido} vehicle={vehicle} currentClient={currentClient} />
        ) : (
          <div className="rounded-xl border border-red-300/60 bg-red-50 p-5 text-red-800 dark:border-red-800/40 dark:bg-red-950/30 dark:text-red-300">
            <p className="font-semibold">Não foi possível abrir a edição</p>
            <p className="mt-1 ds-body">{clientLoadError ?? "Tente novamente em instantes."}</p>
            <Link
              href={`/pedidos/${id}`}
              className="mt-4 inline-flex rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-700 dark:bg-red-950/40 dark:text-red-300"
            >
              Voltar para detalhes do pedido
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
