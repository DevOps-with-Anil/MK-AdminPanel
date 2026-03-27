// types/admin.types.ts
export type AdminType = 'root-admin' | 'tenant-admin';

export interface BackendActionPermission {
  actionKey: string;
  actionName?: Record<string, string>;
  allowed: boolean;
}

export interface BackendPermission {
  moduleKey: string;
  moduleName?: Record<string, string>;
  allowed: boolean;
  actions?: BackendActionPermission[];
}

export interface Role {
  _id: string;
  name: string;
  permissions: BackendPermission[];
}

export interface DeviceInfo {
  ipAddress: string;
  userAgent: string;
  deviceType: string;
  lastUsedAt: string;
}

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: Role;
  roleType?: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastLoginAt: string;
  currentDevice: DeviceInfo;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  status: number;
  data: {
    token: string;
    user: User;
  };
  meta: string;
  messageKey: string;
  message: string;
}

export type Language = 'en' | 'ar' | 'fr' | 'es';
export interface LanguageData {
  code: Language;
  label: string;
  flag: string;
}

export type Country = 'IN' | 'US' | 'AE' | 'FR';
export interface CountryData {
  code: Country;
  label: string;
  flag: string;
}
