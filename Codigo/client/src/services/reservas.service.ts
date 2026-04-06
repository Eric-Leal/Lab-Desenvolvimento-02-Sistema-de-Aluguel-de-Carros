import { API_ENDPOINTS } from '@/config/endpoints';

export const reservasService = {
  async ping(): Promise<string> {
    const res = await fetch(`${API_ENDPOINTS.reservasService}/ping`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  },
};
