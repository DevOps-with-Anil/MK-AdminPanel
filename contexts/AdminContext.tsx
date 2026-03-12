'use client';

import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import {
  AdminType,
  Language,
  Country,
  AdminUser,
  MOCK_USERS,
  TRANSLATIONS,
  MOCK_ROLES,
} from '@/lib/mock-data';
import { clearAuthToken, getRootAdminProfile, type RootAdminProfile } from '@/lib/client-auth';

interface AdminContextType {
  // Current State
  currentAdminType: AdminType;
  currentLanguage: Language;
  currentCountry: Country;
  currentUser: AdminUser;
  rootProfile: RootAdminProfile | null;
  isProfileLoading: boolean;
  profileError: string;

  // Setters
  setAdminType: (type: AdminType) => void;
  setLanguage: (lang: Language) => void;
  setCountry: (country: Country) => void;
  refreshProfile: () => Promise<void>;

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
  const [currentUser, setCurrentUser] = useState<AdminUser>(MOCK_USERS['root-admin']);
  const [rootProfile, setRootProfile] = useState<RootAdminProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState('');

  const refreshProfile = useCallback(async () => {
    if (typeof window === 'undefined') {
      return;
    }

    const token = window.localStorage.getItem('authToken');

    if (!token) {
      setCurrentUser(MOCK_USERS[currentAdminType]);
      setRootProfile(null);
      setIsProfileLoading(false);
      return;
    }

    setIsProfileLoading(true);
    setProfileError('');

    try {
      const apiLanguage = currentLanguage === 'ar' ? 'ar' : 'en';
      const profile = await getRootAdminProfile(apiLanguage);
      const fallbackRole = MOCK_ROLES[currentAdminType];
      const permissions = profile.role.permissions
        .filter((permission) => permission.module && permission.action)
        .map((permission, index) => ({
          id: permission.id || permission._id || `${profile.role._id}-${index}`,
          module: permission.module as string,
          action: permission.action as string,
        }));

      setRootProfile(profile);
      setCurrentUser({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        type: currentAdminType,
        role: {
          id: profile.role._id,
          name: profile.role.name,
          permissions: permissions.length > 0 ? permissions : fallbackRole.permissions,
        },
        country: currentCountry,
        subscriptionPlan: MOCK_USERS[currentAdminType].subscriptionPlan,
        lastLogin: profile.lastLoginAt
          ? new Date(profile.lastLoginAt).toLocaleString()
          : 'N/A',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load profile';
      setProfileError(message);

      if (message.toLowerCase().includes('unauthorized')) {
        clearAuthToken();
      }

      setRootProfile(null);
      setCurrentUser(MOCK_USERS[currentAdminType]);
    } finally {
      setIsProfileLoading(false);
    }
  }, [currentAdminType, currentCountry, currentLanguage]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

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
        rootProfile,
        isProfileLoading,
        profileError,
        setAdminType: handleSetAdminType,
        setLanguage: handleSetLanguage,
        setCountry: handleSetCountry,
        refreshProfile,
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
