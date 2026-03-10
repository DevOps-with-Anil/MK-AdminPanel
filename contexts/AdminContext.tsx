'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  AdminType,
  Language,
  Country,
  SubscriptionPlan,
  AdminUser,
  Role,
  TRANSLATIONS,
} from '@/lib/mock-data';

// User data from backend after login
interface BackendUser {
  _id: string;
  name: string;
  email: string;
  role: {
    _id: string;
    name: string | { en?: string; fr?: string; ar?: string };
    permissions: BackendPermission[];
  };
  status: string;
  subscriptionPlan?: SubscriptionPlan;
}

// Backend permission structure from database
interface BackendPermission {
  moduleKey: string;
  allowed: boolean;
  actions: Array<{
    actionKey: string;
    allowed: boolean;
  }>;
}

interface AdminContextType {
  // Current State
  currentAdminType: AdminType;
  currentLanguage: Language;
  currentCountry: Country;
  currentUser: AdminUser;
  subscriptionPlan: SubscriptionPlan;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Setters
  setAdminType: (type: AdminType) => void;
  setLanguage: (lang: Language) => void;
  setCountry: (country: Country) => void;
  setSubscriptionPlan: (plan: SubscriptionPlan) => void;

  // Helper Functions
  t: (key: string) => string;
  hasPermission: (module: string, action: string) => boolean;
  hasFeature: (feature: string) => boolean;
  canAccessModule: (module: string) => boolean;
  getAccessibleModules: () => string[];
  refreshUserData: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Helper function to extract role name string from backend response
function extractRoleName(role: BackendUser['role']): string {
  if (!role) return '';
  if (typeof role.name === 'string') return role.name;
  if (typeof role.name === 'object') {
    // Handle { en: "ROOT ADMIN", fr: "...", ar: "..." }
    return role.name.en || role.name.fr || role.name.ar || '';
  }
  return '';
}

// Map backend role name to our admin type
function mapRoleToAdminType(roleName: string): AdminType {
  const roleNameNormalized = (roleName || '').trim().toUpperCase();

  if (roleNameNormalized === 'ROOT ADMIN' || roleNameNormalized.includes('SUPER ADMIN')) {
    return 'root-admin';
  }
  if (roleNameNormalized === 'SUB ADMIN' || roleNameNormalized.includes('ROOT SUB')) {
    return 'root-sub-admin';
  }
  if (roleNameNormalized === 'MANAGER') {
    return 'affiliate-admin';
  }
  if (roleNameNormalized === 'SUPPORT' || roleNameNormalized === 'VIEWER') {
    return 'affiliate-sub-admin';
  }
  
  // Default to lowest privileged UI type
  return 'affiliate-admin';
}

// Get permissions from backend user (no fallback)
function getUserPermissions(backendUser: BackendUser | null): Role['permissions'] {
  // If we have permissions from backend, use them
  if (backendUser?.role?.permissions && backendUser.role.permissions.length > 0) {
    // Transform backend permission format to frontend format
    const transformedPermissions: Role['permissions'] = [];
    
    backendUser.role.permissions.forEach((perm: BackendPermission, moduleIndex: number) => {
      if (perm.allowed && perm.actions) {
        perm.actions.forEach((action: { actionKey: string; allowed: boolean }) => {
          if (action.allowed) {
            transformedPermissions.push({
              id: `${moduleIndex}-${transformedPermissions.length + 1}`,
              module: perm.moduleKey,
              action: action.actionKey,
            });
          }
        });
      }
    });
    
    return transformedPermissions;
  }
  
  // NO FALLBACK - Return empty array if no permissions
  console.warn('⚠️ No permissions found in backend user data');
  return [];
}

// Map frontend module names to backend module keys
const MODULE_KEY_MAP: Record<string, string> = {
  'dashboard': 'SYS_DASHBOARD',
  'admin_users': 'SYS_ADMINS',
  'roles_permissions': 'SYS_ROLES',
  'modules_actions': 'SYS_MODULES',
  'permission_packages': 'SYS_PERMISSION_PACKAGES',
  'subscription_plans': 'SUBSCRIPTION_PLANS',
  'affiliates': 'AFFILIATES',
  'countries': 'COUNTRIES',
  'cms': 'CMS',
  'articles': 'ARTICLES',
  'videos': 'VIDEOS',
  'categories': 'CATEGORIES',
  'ads': 'ADS',
  'support_tickets': 'SUPPORT_TICKETS',
  'policies_faq': 'POLICIES_FAQ',
  'settings': 'SETTINGS',
  'sub_admins': 'SUB_ADMINS',
  'challenges': 'CHALLENGES',
  'verification': 'VERIFICATION',
  'profile': 'PROFILE',
  'audit_logs': 'SYS_AUDIT_LOGS',
};

const FRONTEND_ACTION_ALIASES: Record<string, string[]> = {
  view: ['VIEW'],
  create: ['CREATE', 'ADD'],
  edit: ['EDIT', 'UPDATE'],
  update: ['UPDATE', 'EDIT'],
  delete: ['DELETE', 'REMOVE', 'DISABLE'],
  export: ['EXPORT'],
};

function doesActionMatch(requestedAction: string, storedAction: string): boolean {
  const requested = (requestedAction || '').toUpperCase();
  const stored = (storedAction || '').toUpperCase();

  if (!requested || !stored) return false;
  if (stored === requested) return true;

  const aliases = FRONTEND_ACTION_ALIASES[requestedAction.toLowerCase()];
  if (!aliases || aliases.length === 0) return false;

  return aliases.some((alias) => stored.includes(`_${alias}`) || stored.endsWith(alias));
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [currentLanguage, setLanguage] = useState<Language>('en');
  const [currentCountry, setCountry] = useState<Country>('IN');
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>('enterprise');
  const [isLoading, setIsLoading] = useState(true);
  
  // User data from backend (localStorage)
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const [currentAdminType, setCurrentAdminType] = useState<AdminType>('affiliate-admin');

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const userDataStr = localStorage.getItem('userData');
        const token = localStorage.getItem('auth-token') || localStorage.getItem('authToken');

        if (!token) {
          setBackendUser(null);
          router.replace('/login');
          return;
        }

        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          setBackendUser(userData);
          
          // Extract role name (handle both string and object formats)
          const roleName = extractRoleName(userData.role);
          const adminType = mapRoleToAdminType(roleName);
          setCurrentAdminType(adminType);
          
          // Set subscription plan if available from backend
          if (userData.subscriptionPlan) {
            setSubscriptionPlan(userData.subscriptionPlan);
          } else {
            // Default based on role
            if (adminType.startsWith('root')) {
              setSubscriptionPlan('enterprise');
            } else {
              setSubscriptionPlan('pro');
            }
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  // Build current user object from backend data (no fallback)
  const currentUser: AdminUser = {
    id: backendUser?._id || 'guest',
    name: backendUser?.name || 'Guest User',
    email: backendUser?.email || '',
    type: currentAdminType,
    role: {
      id: backendUser?.role?._id || 'guest-role',
      name: backendUser?.role ? extractRoleName(backendUser.role) : 'Guest',
      permissions: getUserPermissions(backendUser),
    },
    country: currentCountry,
    subscriptionPlan: subscriptionPlan,
  };

  // Translation helper
  const t = (key: string): string => {
    return TRANSLATIONS[currentLanguage][key] || key;
  };

  // Check if user can access a module based on backend permissions
  const canAccessModule = (module: string): boolean => {
    // If no permissions loaded yet, deny access
    if (!currentUser.role.permissions || currentUser.role.permissions.length === 0) {
      return false;
    }
    
    // Get backend module key from frontend module name
    const backendModuleKey = MODULE_KEY_MAP[module] || module;
    
    // Check if user has any permission for this module
    return currentUser.role.permissions.some(
      (p) => p.module === backendModuleKey
    );
  };

  // Permission checker - checks backend permissions
  const hasPermission = (module: string, action: string): boolean => {
    // If no permissions loaded yet, deny access
    if (!currentUser.role.permissions || currentUser.role.permissions.length === 0) {
      return false;
    }
    
    // Get backend module key from frontend module name
    const backendModuleKey = MODULE_KEY_MAP[module] || module;
    
    // Check if user has this specific permission
    return currentUser.role.permissions.some(
      (p) => p.module === backendModuleKey && doesActionMatch(action, p.action)
    );
  };

  // Feature checker based on subscription plan
  const hasFeature = (feature: string): boolean => {
    const planFeatures =
      {
        free: ['dashboard', 'cms_basic', 'support_tickets', 'profile', 'categories'],
        pro: [
          'dashboard',
          'cms_full',
          'challenges',
          'ads_basic',
          'support_tickets',
          'analytics',
          'profile',
          'categories',
          'videos',
          'articles',
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
          'profile',
          'categories',
          'videos',
          'articles',
        ],
      }[subscriptionPlan] || [];

    return planFeatures.includes(feature);
  };

  // Get all accessible modules from backend permissions
  const getAccessibleModules = (): string[] => {
    if (!currentUser.role.permissions || currentUser.role.permissions.length === 0) {
      return [];
    }

    const moduleSet = new Set<string>();
    currentUser.role.permissions.forEach((permission) => {
      moduleSet.add(permission.module);
    });

    return Array.from(moduleSet);
  };

  // Refresh user data from localStorage
  const refreshUserData = () => {
    setIsLoading(true);
    try {
      const userDataStr = localStorage.getItem('userData');
      const token = localStorage.getItem('auth-token') || localStorage.getItem('authToken');

      if (!token) {
        setBackendUser(null);
        router.replace('/login');
        return;
      }

      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        setBackendUser(userData);
        
        const roleName = userData.role ? extractRoleName(userData.role) : '';
        const adminType = mapRoleToAdminType(roleName);
        setCurrentAdminType(adminType);
        
        if (userData.subscriptionPlan) {
          setSubscriptionPlan(userData.subscriptionPlan);
        }
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  const handleSetCountry = (country: Country) => {
    setCountry(country);
  };

  const handleSetSubscriptionPlan = (plan: SubscriptionPlan) => {
    setSubscriptionPlan(plan);
  };

  // For backward compatibility - but we don't use dropdown anymore
  const handleSetAdminType = (type: AdminType) => {
    // This is kept for compatibility but won't be used in production
    setCurrentAdminType(type);
  };

  // Avoid SSR/client hydration mismatch in admin pages that render
  // runtime-only values (dates/localized strings from browser context).
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!backendUser) {
    return null;
  }

  return (
    <AdminContext.Provider
      value={{
        currentAdminType,
        currentLanguage,
        currentCountry,
        currentUser,
        subscriptionPlan,
        isAuthenticated: !!backendUser,
        isLoading,
        setAdminType: handleSetAdminType,
        setLanguage: handleSetLanguage,
        setCountry: handleSetCountry,
        setSubscriptionPlan: handleSetSubscriptionPlan,
        t,
        hasPermission,
        hasFeature,
        canAccessModule,
        getAccessibleModules,
        refreshUserData,
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

