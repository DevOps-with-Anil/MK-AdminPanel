'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  AdminType,
  Language,
  Country,
  AdminUser,
  MOCK_USERS,
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

export function AdminProvider({ children }: { children: ReactNode }) {
  const [currentAdminType, setAdminTypeState] = useState<AdminType>('root-admin');
  const [currentLanguage, setLanguage] = useState<Language>('en');
  const [currentCountry, setCountry] = useState<Country>('IN');
  const [currentUser, setCurrentUserState] = useState<AdminUser>(MOCK_USERS['root-admin']);

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
    const nextUser = MOCK_USERS[type];
    setAdminTypeState(type);
    setCurrentUserState(nextUser);
    persistAdminUser(nextUser);
  };

  const handleSetCurrentUser = (user: AdminUser | BackendUser) => {
    const backendUser =
      'type' in user
        ? user
        : ('user' in user && user.user ? user.user : user);

    const normalizedUser =
      'type' in backendUser
        ? backendUser
        : mapBackendUserToAdminUser(
            backendUser,
            inferAdminType({
              token: tokenStorage.get(),
              roleType: backendUser.roleType,
              roleName: backendUser.role?.name,
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
