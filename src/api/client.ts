// Skill-TERN Unified API Client

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: any) {
  localStorage.setItem('user', JSON.stringify(user));
}

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({ success: false, message: 'Invalid response from server' }));

  if (!response.ok || data.success === false) {
    const error = new Error(data.message || `Request failed with status ${response.status}`) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  auth: {
    login: (identifier: string, password: string) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
      }),
    register: (userData: any) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    me: () => request('/auth/me'),
  },

  users: {
    getMe: () => request('/users/me'),
    updateMe: (data: any) =>
      request('/users/me', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    addSkill: (skillId: string, list: 'teach' | 'learn') =>
      request('/users/me/skills', {
        method: 'POST',
        body: JSON.stringify({ skillId, list }),
      }),
    removeSkill: (skillId: string, list: 'teach' | 'learn') =>
      request(`/users/me/skills/${encodeURIComponent(skillId)}?list=${list}`, { method: 'DELETE' }),
    getMatches: () => request('/users/matches'),
    getAll: (params: { search?: string; category?: string } = {}) => {
      const q = new URLSearchParams();
      if (params.search) q.append('search', params.search);
      if (params.category) q.append('category', params.category);
      return request(`/users?${q.toString()}`);
    },
    getById: (id: string) => request(`/users/${id}`),
  },

  skills: {
    getAll: () => request('/skills'),
  },

  swaps: {
    getReceived: () => request('/swaps/received'),
    getSent: () => request('/swaps/sent'),
    getActive: () => request('/swaps/active'),
    create: (data: { receiver: string; skillOffered: string; skillWanted: string; message?: string }) =>
      request('/swaps', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    accept: (id: string) =>
      request(`/swaps/${id}/accept`, {
        method: 'PUT',
      }),
    reject: (id: string) =>
      request(`/swaps/${id}/reject`, {
        method: 'PUT',
      }),
    complete: (id: string) =>
      request(`/swaps/${id}/complete`, {
        method: 'PUT',
      }),
  },

  messages: {
    getThread: (userId: string) => request(`/messages/${userId}`),
    send: (receiver: string, text: string) =>
      request('/messages', {
        method: 'POST',
        body: JSON.stringify({ receiver, text }),
      }),
  },

  wallet: {
    get: () => request('/wallet'),
    getTransactions: () => request('/transactions'),
  },

  internships: {
    getAll: () => request('/internships'),
    getMine: () => request('/internships/recruiter/mine'),
    getById: (id: string) => request(`/internships/${id}`),
    create: (data: any) =>
      request('/internships', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    apply: (id: string, coverLetter?: string) =>
      request(`/internships/${id}/apply`, {
        method: 'POST',
        body: JSON.stringify({ coverLetter }),
      }),
  },

  applications: {
    getMy: () => request('/internships/student/my-applications'),
    getRecruiter: () => request('/internships/recruiter/all-applications'),
    updateStatus: (id: string, status: string, notes?: string) =>
      request(`/internships/applications/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, notes }),
      }),
  },
};
