import axios from 'axios'

type ViaCepResponse = {
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
  erro?: boolean
}

export type ViaCepAddress = {
  logradouro: string
  bairro: string
  cidade: string
  estado: string
}

export async function fetchAddressByCep(cep: string): Promise<ViaCepAddress | null> {
  const normalizedCep = cep.replace(/\D/g, '')
  if (normalizedCep.length !== 8) return null

  const { data } = await axios.get<ViaCepResponse>(`https://viacep.com.br/ws/${normalizedCep}/json/`, {
    timeout: 7000,
  })

  if (data.erro) return null

  return {
    logradouro: data.logradouro || '',
    bairro: data.bairro || '',
    cidade: data.localidade || '',
    estado: data.uf || '',
  }
}
