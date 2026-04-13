import { VehicleManagementClient } from "@/components/veiculos/gestao/VehicleManagementClient"

export const metadata = {
  title: "Gestão de Veículos — CarFlow",
  description: "Painel do locador para cadastrar, editar e remover veículos da frota.",
}

export default function GestaoVeiculosPage() {
  return (
    <div className="min-h-screen bg-page">
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
            Painel do Locador
          </p>
          <h1 className="mt-2 text-4xl text-text-primary lg:text-5xl" style={{ fontFamily: "var(--font-dm-serif)" }}>
            Gestão de Veículos
          </h1>
          <p className="mt-3 ds-body-lg max-w-2xl text-text-secondary">
            Cadastre novos veículos, ajuste preço de diária, edite dados da frota e remova veículos descontinuados.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-12">
        <VehicleManagementClient />
      </main>
    </div>
  )
}
