'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  AdminType,
  Language,
  Country,
  SubscriptionPlan,
  AdminUser,
  MOCK_USERS,
  TRANSLATIONS,
  MODULES,
  ACTIONS,
} from '@/lib/mock-data';

interface AdminContextType {
  // Current State
  currentAdminType: AdminType;
  currentLanguage: Language;
  currentCountry: Country;
  currentUser: AdminUser;

  // Setters
  setAdminType: (type: AdminType) => void;
  setLanguage: (lang: Language) => void;
  setCountry: (country: Country) => void;

  // Helper Functions
  t: (key: string) => string;
  hasPermission: (module: string, action: string) => boolean;
  hasFeature: (feature: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [currentAdminType, setAdminType] = useState<AdminType>('root-admin');
  const [currentLanguage, setLanguage] = useState<Language>('en');
  const [currentCountry, setCountry] = useState<Country>('IN');

  const currentUser = MOCK_USERS[currentAdminType];

  // Translation helper
  const t = (key: string): string => {
    return TRANSLATIONS[currentLanguage][key] || key;
  };

  // Permission checker
  const hasPermission = (module: string, action: string): boolean => {
    return currentUser.role.permissions.some(
      (p) => p.module === module && p.action === action
    );
  };

  // Feature checker based on subscription plan
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

  const handleSetAdminType = (type: AdminType) => {
    setAdminType(type);
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  const handleSetCountry = (country: Country) => {
    setCountry(country);
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
