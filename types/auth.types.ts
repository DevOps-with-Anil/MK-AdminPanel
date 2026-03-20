// auth.types.ts
export interface AdminRole {
  _id: string;
  name: string;
  permissions: string[];
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: string;
  lastLoginAt: string;
  currentDevice: {
    ipAddress: string;
    userAgent: string;
    deviceType: string;
    lastUsedAt: string;
  };
}

export interface LoginResponse {
  success: boolean;
  status: number;
  message: string;
  messageKey: string;
  meta?: string;
  data: {
    token: string;
    user: AdminUser;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}