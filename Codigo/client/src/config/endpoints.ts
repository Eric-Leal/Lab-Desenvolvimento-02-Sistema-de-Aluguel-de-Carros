const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  usersService: `${API_URL}/usersService`,
  vehiclesService: `${API_URL}/vehiclesService`,
  rentalsService: `${API_URL}/rentalsService`,
  contratoService: `${API_URL}/contratoService`,
  reservasService: `${API_URL}/reservasService`,
} as const;
