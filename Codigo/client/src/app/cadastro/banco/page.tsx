import { redirect } from 'next/navigation'

export default function CadastroBancoPage() {
  redirect('/cadastro?tipo=banco')
}
