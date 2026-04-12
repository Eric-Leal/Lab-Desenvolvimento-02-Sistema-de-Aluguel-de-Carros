import { Navbar } from "@/components/navbar/Navbar"
import { VehicleGrid } from "@/components/veiculos/VehicleGrid"
import { vehiclesService } from "@/services/vehicles.service"
import { usersService } from "@/services/users.service"
import type { Automovel } from "@/types/vehicle"

export const metadata = {
  title: "Nossos Veículos — CarFlow",
  description: "Encontre o veículo perfeito para sua próxima locação.",
}

export default async function VeiculosPage() {
  let vehicles: Automovel[] = []
  let locadoresMap: Record<string, string> = {}

  try {
    vehicles = await vehiclesService.listar()
    const locadorIds = vehicles.map((v) => v.locadorOriginalId)
    locadoresMap = await usersService.buscarAgents(locadorIds)
  } catch {
    vehicles = []
  }

  return (
    <div className="min-h-screen bg-page">
      <Navbar />

      {/* Hero da seção com gradiente */}
      <div className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(26,77,168,0.10) 0%, rgba(56,122,222,0.06) 40%, transparent 70%), radial-gradient(ellipse at top right, rgba(56,122,222,0.12), transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
          <div className="space-y-2">
            <p className="ds-caption font-semibold uppercase tracking-widest text-text-brand">
              Frota disponível
            </p>
            <h1
              className="text-4xl text-text-primary lg:text-5xl"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Nossos Veículos
            </h1>
            <p className="ds-body-lg max-w-xl">
              Encontre o veículo perfeito para sua próxima locação
            </p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-10">
        <VehicleGrid vehicles={vehicles} locadoresMap={locadoresMap} />
      </main>
    </div>
  )
}
