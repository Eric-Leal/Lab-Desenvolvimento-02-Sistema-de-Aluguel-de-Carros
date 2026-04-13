import { z } from 'zod'

export const configuracoesSchema = z.object({
  nome: z.string().trim().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().trim().email('E-mail invalido'),
  profissao: z.string().trim().optional(),
  cep: z.string().trim().min(8, 'CEP invalido'),
  logradouro: z.string().trim().min(2, 'Logradouro e obrigatorio'),
  numero: z.string().trim().min(1, 'Numero e obrigatorio'),
  bairro: z.string().trim().min(2, 'Bairro e obrigatorio'),
  cidade: z.string().trim().min(2, 'Cidade e obrigatoria'),
  estado: z.string().trim().length(2, 'Estado deve ter 2 letras'),
})

export type ConfiguracoesFormInput = z.infer<typeof configuracoesSchema>

export type ConfiguracoesNormalizedData = z.infer<typeof configuracoesSchema>

export type EnderecoPayload = {
  cep: string
  logradouro: string
  numero: string
  bairro: string
  cidade: string
  estado: string
}

export type ConfiguracoesUpdatePayload = {
  nome: string
  email: string
  profissao: string
  endereco: EnderecoPayload
  ['endereço']: EnderecoPayload
}

export function parseConfiguracoesForm(input: ConfiguracoesFormInput) {
  return configuracoesSchema.safeParse({
    nome: input.nome.trim(),
    email: input.email.trim(),
    profissao: input.profissao?.trim() || '',
    cep: input.cep.replace(/\D/g, ''),
    logradouro: input.logradouro.trim(),
    numero: input.numero.trim(),
    bairro: input.bairro.trim(),
    cidade: input.cidade.trim(),
    estado: input.estado.trim().toUpperCase(),
  })
}

export function buildConfiguracoesUpdatePayload(data: ConfiguracoesNormalizedData): ConfiguracoesUpdatePayload {
  const endereco: EnderecoPayload = {
    cep: data.cep,
    logradouro: data.logradouro,
    numero: data.numero,
    bairro: data.bairro,
    cidade: data.cidade,
    estado: data.estado,
  }

  return {
    nome: data.nome,
    email: data.email,
    profissao: data.profissao || '',
    endereco,
    ['endereço']: endereco,
  }
}
