import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar/NavbarV1"
import { DevClientSelector } from "@/components/dev/DevClientSelector"
import { SolicitarAluguelClient } from "@/components/veiculos/SolicitarAluguelClient"
import { vehiclesService } from "@/services/vehicles.service"

interface Props {
  params: Promise<{ matricula: string }>
}

export async function generateMetadata({ params }: Props) {
  const { matricula } = await params
  try {
    const vehicle = await vehiclesService.buscarPorMatricula(Number(matricula))
    return {
      title: `Solicitar ${vehicle.marca} ${vehicle.modelo} — CarFlow`,
    }
  } catch {
    return { title: "Solicitar Aluguel — CarFlow" }
  }
}

export default async function SolicitarAluguelPage({ params }: Props) {
  const { matricula } = await params

  let vehicle
  try {
    vehicle = await vehiclesService.buscarPorMatricula(Number(matricula))
  } catch {
    notFound()
  }

  if (!vehicle.disponivel) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-page">
      <DevClientSelector />
      <Navbar />

      {/* Hero com gradiente */}
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
            href={`/veiculos/${matricula}`}
            className="mb-4 inline-flex items-center gap-1.5 ds-body text-text-secondary transition-colors hover:text-text-primary"
          >
            <ChevronLeft size={16} />
            Voltar
          </Link>
          <h1
            className="text-3xl text-text-primary lg:text-4xl"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Solicitar Aluguel
          </h1>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-6 py-10 lg:px-10 lg:py-14">
        <SolicitarAluguelClient vehicle={vehicle} />
      </main>
    </div>
  )
}
