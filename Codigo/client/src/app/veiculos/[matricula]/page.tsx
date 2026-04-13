import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar/NavbarV1"
import { DevClientSelector } from "@/components/dev/DevClientSelector"
import { VehicleDetailGallery } from "@/components/veiculos/VehicleDetailGallery"
import { VehicleDetailInfo } from "@/components/veiculos/VehicleDetailInfo"
import { vehiclesService } from "@/services/vehicles.service"

interface VeiculoDetalhePageProps {
  params: Promise<{ matricula: string }>
}

export async function generateMetadata({ params }: VeiculoDetalhePageProps) {
  const { matricula } = await params
  try {
    const vehicle = await vehiclesService.buscarPorMatricula(Number(matricula))
    return {
      title: `${vehicle.marca} ${vehicle.modelo} — CarFlow`,
      description: `${vehicle.marca} ${vehicle.modelo} ${vehicle.ano} — R$ ${vehicle.valorDiaria}/dia`,
    }
  } catch {
    return { title: "Veículo — CarFlow" }
  }
}

export default async function VeiculoDetalhePage({ params }: VeiculoDetalhePageProps) {
  const { matricula } = await params

  let vehicle
  try {
    vehicle = await vehiclesService.buscarPorMatricula(Number(matricula))
  } catch {
    notFound()
  }

  return (
    <div className="min-h-screen bg-page">
      <DevClientSelector />
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
        <Link
          href="/veiculos"
          className="mb-8 inline-flex items-center gap-2 ds-body text-text-secondary transition-colors hover:text-text-primary"
        >
          <ChevronLeft size={16} />
          Voltar
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <VehicleDetailGallery vehicle={vehicle} />
          <VehicleDetailInfo vehicle={vehicle} />
        </div>
      </main>
    </div>
  )
}
