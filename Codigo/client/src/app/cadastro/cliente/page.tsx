import { redirect } from 'next/navigation'

export default function CadastroClientePage() {
  redirect('/cadastro?tipo=cliente')
}
