import { API_ENDPOINTS } from "@/config/endpoints";

export const microsservicoBService = {
  /**
   * Verifica a saúde do Microserviço B via Gateway
   */
  ping: async () => {
    const response = await fetch(`${API_ENDPOINTS.serviceB}/ping`);
    if (!response.ok) throw new Error("Erro ao conectar com Microserviço B");
    const text = await response.text();
    return text || "OK";
  }
};
