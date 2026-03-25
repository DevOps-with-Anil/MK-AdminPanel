'use client';

import React, { createContext, useContext, useState, ReactNode, useContext as useReactContext, useEffect } from 'react';
import {
  AdminType,
  Language,
  Country,
  AdminUser,
  MOCK_USERS,
} from '@/lib/mock-data';
import { I18nContext } from '@/i18n/provider';

interface AdminContextType {
  // State
  currentAdminType: AdminType;
  currentLanguage: Language;
  currentCountry: Country;
  currentUser: AdminUser;

  // Setters
  setAdminType: (type: AdminType) => void;
  setLanguage: (lang: Language) => void;
  setCountry: (country: Country) => void;
  setCurrentUser: (user: AdminUser) => void;

  // Helpers
  t: (key: string) => string;
  hasPermission: (module: string, action: string) => boolean;
  hasFeature: (feature: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { t, changeLanguage } = useReactContext(I18nContext); // ✅ use i18n here

  const [currentAdminType, setAdminType] = useState<AdminType>('root-admin');
  const [currentLanguage, setLanguage] = useState<Language>('en');
  const [currentCountry, setCountry] = useState<Country>('IN');
  const [currentUser, setCurrentUser] = useState<AdminUser>(
    MOCK_USERS['root-admin']
  );

  // ✅ Load saved language on mount
  useEffect(() => {
    const savedLang = (localStorage.getItem('lang') as Language) || 'en';
    setLanguage(savedLang);
    changeLanguage(savedLang);
  }, []);

  // ✅ Sync language everywhere
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  // ✅ Admin type change
  const handleSetAdminType = (type: AdminType) => {
    setAdminType(type);
    setCurrentUser(MOCK_USERS[type]);
  };

  const handleSetCountry = (country: Country) => {
    setCountry(country);
  };

  // ✅ Permission checker
  const hasPermission = (module: string, action: string): boolean => {
    return currentUser.role.permissions.some(
      (p) => p.module === module && p.action === action
    );
  };

  // ✅ Feature checker
  const hasFeature = (feature: string): boolean => {
    const planFeatures =
      {
        free: ['dashboard', 'cms_basic', 'support_tickets'],
        pro: [
          'dashboard',
          'cms_full',
          'challenges',
          'ads_basic',
          'support_tickets',
          'analytics',
        ],
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

  return (
    <AdminContext.Provider
      value={{
        currentAdminType,
        currentLanguage,
        currentCountry,
        currentUser,
        setAdminType: handleSetAdminType,
        setLanguage: handleSetLanguage,
        setCountry: handleSetCountry,
        setCurrentUser,
        t, // ✅ from I18nProvider
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