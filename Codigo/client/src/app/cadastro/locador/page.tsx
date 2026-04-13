import { redirect } from 'next/navigation'

export default function CadastroLocadorPage() {
  redirect('/cadastro?tipo=locador')
}
