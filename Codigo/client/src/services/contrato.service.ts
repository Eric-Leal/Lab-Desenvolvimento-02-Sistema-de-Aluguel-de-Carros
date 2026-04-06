import { API_ENDPOINTS } from '@/config/endpoints';

export const contratoService = {
  async ping(): Promise<string> {
    const res = await fetch(`${API_ENDPOINTS.contratoService}/ping`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  },
};
