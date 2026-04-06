import { API_ENDPOINTS } from "@/config/endpoints";

export const usersService = {
  ping: async () => {
    const response = await fetch(`${API_ENDPOINTS.usersService}/ping`);
    if (!response.ok) throw new Error("Erro ao conectar com usersService");
    const text = await response.text();
    return text || "OK";
  },
};
