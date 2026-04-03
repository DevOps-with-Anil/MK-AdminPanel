'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  AdminType,
  Language,
  Country,
  AdminUser,
  TRANSLATIONS,
} from '@/lib/mock-data';
import {
  inferAdminType,
  isRootUser,
  mapBackendUserToAdminUser,
  persistAdminUser,
  readStoredAdminUser,
} from '@/lib/rbac';
import type { User as BackendUser } from '@/types/admin.types';
import { tokenStorage } from '@/utils/token';

interface AdminContextType {
  currentAdminType: AdminType;
  currentLanguage: Language;
  currentCountry: Country;
  currentUser: AdminUser;
  setAdminType: (type: AdminType) => void;
  setLanguage: (lang: Language) => void;
  setCountry: (country: Country) => void;
  setCurrentUser: (user: AdminUser | BackendUser) => void;
  t: (key: string) => string;
  hasPermission: (module: string, action: string) => boolean;
  hasFeature: (feature: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const EMPTY_ADMIN_USER: AdminUser = {
  id: '',
  name: '',
  email: '',
  type: 'root-admin',
  role: {
    id: '',
    name: '',
    permissions: [],
  },
  country: 'IN',
  subscriptionPlan: 'enterprise',
  lastLogin: '',
};

function isAdminUser(user: AdminUser | BackendUser): user is AdminUser {
  return 'type' in user;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [currentAdminType, setAdminTypeState] = useState<AdminType>('root-admin');
  const [currentLanguage, setLanguage] = useState<Language>('en');
  const [currentCountry, setCountry] = useState<Country>('IN');
  const [currentUser, setCurrentUserState] = useState<AdminUser>(EMPTY_ADMIN_USER);

  useEffect(() => {
    const storedUser = readStoredAdminUser();
    if (!storedUser) {
      return;
    }

    setCurrentUserState(storedUser);
    setAdminTypeState(storedUser.type);
  }, []);

  const t = (key: string): string => {
    return TRANSLATIONS[currentLanguage][key] || key;
  };

  const hasPermission = (module: string, action: string): boolean => {
    if (currentAdminType === 'root-admin' || isRootUser(currentUser)) {
      return true;
    }

    return currentUser.role.permissions.some(
      (permission) => permission.module === module && permission.action === action
    );
  };

  const hasFeature = (feature: string): boolean => {
    const planFeatures =
      {
        free: ['dashboard', 'cms_basic', 'support_tickets'],
        pro: ['dashboard', 'cms_full', 'challenges', 'ads_basic', 'support_tickets', 'analytics'],
        enterprise: [
          'dashboard',
          'cms_full',
          'challenges',
          'ads_full',
          'support_tickets',
          'analytics',
          'api_access',
          'custom_roles',
          'bulk_export',
        ],
      }[currentUser.subscriptionPlan] || [];

    return planFeatures.includes(feature);
  };

  const handleSetAdminType = (type: AdminType) => {
    setAdminTypeState(type);
  };

  const handleSetCurrentUser = (user: AdminUser | BackendUser) => {
    const normalizedUser = isAdminUser(user)
      ? user
      : mapBackendUserToAdminUser(
          user,
          inferAdminType({
            token: tokenStorage.get(),
            roleType: user.roleType,
            roleName: user.role?.name,
          })
        );

    setCurrentUserState(normalizedUser);
    setAdminTypeState(normalizedUser.type);
    persistAdminUser(normalizedUser);
  };

  return (
    <AdminContext.Provider
      value={{
        currentAdminType,
        currentLanguage,
        currentCountry,
        currentUser,
        setAdminType: handleSetAdminType,
        setLanguage,
        setCountry,
        setCurrentUser: handleSetCurrentUser,
        t,
        hasPermission,
        hasFeature,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
