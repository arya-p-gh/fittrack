const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const apiFetch = async (path: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem('fittrack_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401 || res.status === 403) {
    // Token invalid/expired — clear and force re-login
    localStorage.removeItem('fittrack_token');
    localStorage.removeItem('fittrack_user');
    window.location.href = '/login';
  }

  return res;
};
