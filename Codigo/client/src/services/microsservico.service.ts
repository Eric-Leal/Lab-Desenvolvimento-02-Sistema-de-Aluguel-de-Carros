import { API_ENDPOINTS } from "@/config/endpoints";

export const microsservicoService = {
  /**
   * Verifica a saúde do usersService via Gateway
   */
  ping: async () => {
    const response = await fetch(`${API_ENDPOINTS.serviceA}/health`);
    if (!response.ok) throw new Error("Erro ao conectar com usersService");
    const data = await response.json();
    return data?.status || "OK";
  }
};
