import { API_ENDPOINTS } from "@/config/endpoints";

function getAccessToken(): string | null {
  if (typeof document !== "undefined") {
    const cookie = document.cookie
      .split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith("carflow_token="));
    if (cookie) {
      const token = cookie.slice("carflow_token=".length);
      if (token) return decodeURIComponent(token);
    }
  }

  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }

  return null;
}

function withAuthHeaders(base: HeadersInit = {}): HeadersInit {
  const token = getAccessToken();
  if (!token) return base;
  return {
    ...base,
    Authorization: `Bearer ${token}`,
  };
}

export interface AgentBasic {
  id: string;
  nome: string;
  email: string;
  imageUrl?: string;
}

export interface ClientBasic {
  id: string;
  nome: string;
  email: string;
  rendimentoTotal: number;
  profissao?: string;
  documento?: string;
  endereco?: {
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  };
  address?: {
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  };
  ['endereço']?: {
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  };
}

export const usersService = {
  ping: async () => {
    const response = await fetch(`${API_ENDPOINTS.usersService}/ping`);
    if (!response.ok) throw new Error("Erro ao conectar com usersService");
    const text = await response.text();
    return text || "OK";
  },

  buscarAgent: async (id: string): Promise<AgentBasic | null> => {
    const token = getAccessToken();
    if (!token) return null;

    const response = await fetch(`${API_ENDPOINTS.usersService}/agent/${id}`, {
      cache: "no-store",
      headers: withAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Agent ${id} não encontrado`);
    return response.json();
  },

  buscarAgents: async (ids: string[]): Promise<Record<string, string>> => {
    const token = getAccessToken();
    if (!token) return {};

    const unique = [...new Set(ids)];
    const results = await Promise.allSettled(
      unique.map((id) => usersService.buscarAgent(id))
    );
    const map: Record<string, string> = {};
    results.forEach((result, i) => {
      if (result.status === "fulfilled" && result.value) {
        map[unique[i]] = result.value.nome;
      }
    });
    return map;
  },

  buscarClient: async (id: string): Promise<ClientBasic> => {
    const response = await fetch(`${API_ENDPOINTS.usersService}/client/${id}`, {
      cache: "no-store",
      headers: withAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Client ${id} não encontrado`);
    return response.json();
  },
};
