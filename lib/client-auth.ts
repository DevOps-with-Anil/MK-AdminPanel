'use client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
const AUTH_TOKEN_KEY = 'authToken';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  success?: boolean;
  message?: string;
  error?: string;
  data?: {
    token?: string;
  };
}

interface RootProfileResponse {
  success?: boolean;
  message?: string;
  error?: string;
  data?: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string | null;
    photo: string | null;
    role: {
      _id: string;
      name: string;
      permissions: Array<{
        _id?: string;
        id?: string;
        module?: string;
        action?: string;
      }>;
    };
    allowedCountries: string[];
    status: string;
    lastLoginAt: string | null;
  };
}

export interface RootAdminProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  photo: string | null;
  role: {
    _id: string;
    name: string;
    permissions: Array<{
      _id?: string;
      id?: string;
      module?: string;
      action?: string;
    }>;
  };
  allowedCountries: string[];
  status: string;
  lastLoginAt: string | null;
}

interface ChangePasswordResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

interface UpdateProfilePayload {
  name: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  photo: string;
}

interface UpdateProfileResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

const isBrowser = typeof window !== 'undefined';

function buildApiUrl(endpoint: string) {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint;
  }

  return `${API_BASE_URL}${endpoint}`;
}

export function getAuthToken(): string | null {
  if (!isBrowser) {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string) {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function logout() {
  clearAuthToken();
}

export async function loginRootAdmin(payload: LoginPayload): Promise<string> {
  const response = await fetch(buildApiUrl('/api/auth/root'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result: LoginResponse = await response.json().catch(() => ({}));

  if (!response.ok || !result.success) {
    throw new Error(result.message || result.error || 'Login failed');
  }

  const token = result.data?.token;

  if (!token) {
    throw new Error('Token not found in response');
  }

  return token;
}

export async function authFetch(input: string, init: RequestInit = {}) {
  const token = getAuthToken();
  const headers = new Headers(init.headers);

  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(buildApiUrl(input), {
    ...init,
    headers,
  });
}

export async function getRootAdminProfile(language = 'en'): Promise<RootAdminProfile> {
  const response = await authFetch('/api/auth/root/me', {
    method: 'GET',
    headers: {
      'Accept-Language': language,
    },
  });

  const result: RootProfileResponse = await response.json().catch(() => ({}));

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.message || result.error || 'Failed to fetch profile');
  }

  return result.data;
}

export async function changeRootAdminPassword(
  currentPassword: string,
  newPassword: string,
  language = 'en'
) {
  const response = await authFetch('/api/auth/root/changepassword', {
    method: 'POST',
    headers: {
      'Accept-Language': language,
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  const result: ChangePasswordResponse = await response.json().catch(() => ({}));

  if (!response.ok || !result.success) {
    throw new Error(result.message || result.error || 'Failed to change password');
  }

  return result;
}

export async function updateRootAdminProfile(
  payload: UpdateProfilePayload,
  language = 'en'
) {
  const response = await authFetch('/api/auth/root/updateprofile', {
    method: 'PUT',
    headers: {
      'Accept-Language': language,
    },
    body: JSON.stringify(payload),
  });

  const result: UpdateProfileResponse = await response.json().catch(() => ({}));

  if (!response.ok || !result.success) {
    throw new Error(result.message || result.error || 'Failed to update profile');
  }

  return result;
}

export { AUTH_TOKEN_KEY };
