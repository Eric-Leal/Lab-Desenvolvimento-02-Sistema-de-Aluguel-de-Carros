import * as z from 'zod'

export type AccountType = 'cliente' | 'locador' | 'banco'

const empregoSchema = z.object({
  empresaNome: z.string().optional(),
  cnpj: z.string().optional(),
  rendimento: z.string().optional(),
})

export const cadastroSchema = z
  .object({
    nome: z.string().min(1, 'Nome e obrigatorio'),
    email: z.string().email('E-mail invalido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirmacao de senha e obrigatoria'),
    documento: z.string().min(1, 'Documento e obrigatorio'),
    rg: z.string().optional(),
    profissao: z.string().optional(),
    logradouro: z.string().min(1, 'Logradouro e obrigatorio'),
    numero: z.string().min(1, 'Numero e obrigatorio'),
    complemento: z.string().optional(),
    bairro: z.string().min(1, 'Bairro e obrigatorio'),
    cidade: z.string().min(1, 'Cidade e obrigatorio'),
    estado: z.string().min(2, 'Estado invalido').max(2, 'Use a sigla (ex: SP)'),
    cep: z.string().min(8, 'CEP incompleto'),
    empregos: z.array(empregoSchema).max(3).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas nao coincidem',
    path: ['confirmPassword'],
  })

export type CadastroFormData = z.infer<typeof cadastroSchema>

type CadastroEndpointResult = {
  endpoint: '/usersService/client' | '/usersService/agent'
  body: Record<string, unknown>
}

export function buildCadastroRequest(data: CadastroFormData, accountType: AccountType): CadastroEndpointResult {
  const cleanDocumento = data.documento.replace(/\D/g, '')

  if (cleanDocumento.length !== 11 && cleanDocumento.length !== 14) {
    throw new Error('CPF deve ter 11 digitos ou CNPJ deve ter 14 digitos')
  }

  const address = {
    logradouro: data.logradouro,
    numero: data.numero,
    complemento: data.complemento,
    bairro: data.bairro,
    cidade: data.cidade,
    estado: data.estado,
    cep: data.cep.replace(/\D/g, ''),
  }

  const commonData = {
    nome: data.nome,
    email: data.email,
    password: data.password,
    documento: cleanDocumento,
    endereco: address,
    enderecoLegacy: address,
  }

  if (accountType === 'cliente') {
    return {
      endpoint: '/usersService/client',
      body: {
        nome: commonData.nome,
        email: commonData.email,
        password: commonData.password,
        documento: commonData.documento,
        endereco: commonData.endereco,
        ['endereço']: commonData.enderecoLegacy,
        rg: data.rg?.replace(/\D/g, ''),
        profissao: data.profissao,
        empregos: data.empregos
          ?.filter((emp) => emp.empresaNome && emp.cnpj)
          .map((emp) => ({
            ...emp,
            cnpj: emp.cnpj?.replace(/\D/g, ''),
            rendimento: parseFloat(emp.rendimento || '0') || 0,
          })),
      },
    }
  }

  return {
    endpoint: '/usersService/agent',
    body: {
      nome: commonData.nome,
      email: commonData.email,
      password: commonData.password,
      documento: commonData.documento,
      endereco: commonData.endereco,
      ['endereço']: commonData.enderecoLegacy,
      tipo: accountType.toUpperCase(),
    },
  }
}
