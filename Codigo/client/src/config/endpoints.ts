const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  serviceA: `${API_URL}/microsservico`,
  serviceB: `${API_URL}/microsservico-b`,
} as const;
