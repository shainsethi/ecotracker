const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
  };
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

function getAuthHeaders(providedToken?: string): Record<string, string> {
  const token = providedToken || localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('Content-Type') || '';
  const hasJson = contentType.includes('application/json');
  const data = hasJson ? await response.json() : null;

  if (!response.ok) {
    const errorMessage = (data && (data.error || data.message)) || 'Request failed';
    throw new Error(errorMessage);
  }

  return (data as T);
}

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    return handleJsonResponse<AuthResponse>(response);
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, name })
    });

    return handleJsonResponse<AuthResponse>(response);
  }

  async validateToken(token?: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(token)
      }
    });

    const data = await handleJsonResponse<{ user: User }>(response);
    return data.user;
  }
}

export const authService = new AuthService();