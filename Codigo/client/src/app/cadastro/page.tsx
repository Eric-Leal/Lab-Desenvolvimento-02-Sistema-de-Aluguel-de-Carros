import { CadastroForm } from '@/components/forms/cadastro-form'

type CadastroPageProps = {
  searchParams?: Promise<{ tipo?: string }>
}

export default async function CadastroPage({ searchParams }: CadastroPageProps) {
  const resolvedParams = (await searchParams) ?? {}
  const type = resolvedParams.tipo
  const initialType = type === 'locador' || type === 'banco' ? type : 'cliente'

  return <CadastroForm initialType={initialType} />
}