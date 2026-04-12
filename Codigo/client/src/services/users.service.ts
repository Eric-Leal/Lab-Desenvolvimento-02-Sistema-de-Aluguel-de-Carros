import { API_ENDPOINTS } from "@/config/endpoints";

export interface AgentBasic {
  id: string;
  nome: string;
  email: string;
  imageUrl?: string;
}

export const usersService = {
  ping: async () => {
    const response = await fetch(`${API_ENDPOINTS.usersService}/ping`);
    if (!response.ok) throw new Error("Erro ao conectar com usersService");
    const text = await response.text();
    return text || "OK";
  },

  buscarAgent: async (id: string): Promise<AgentBasic> => {
    const response = await fetch(`${API_ENDPOINTS.usersService}/agent/${id}`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Agent ${id} não encontrado`);
    return response.json();
  },

  buscarAgents: async (ids: string[]): Promise<Record<string, string>> => {
    const unique = [...new Set(ids)];
    const results = await Promise.allSettled(
      unique.map((id) => usersService.buscarAgent(id))
    );
    const map: Record<string, string> = {};
    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        map[unique[i]] = result.value.nome;
      }
    });
    return map;
  },
};
