import { API_ENDPOINTS } from '@/config/endpoints';

export const rentalsService = {
  async ping(): Promise<string> {
    const res = await fetch(`${API_ENDPOINTS.rentalsService}/ping`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  },
};
