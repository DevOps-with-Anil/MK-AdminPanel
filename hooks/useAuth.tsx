/**
 * useAuth Hook
 * Client-side authentication and permission checking
 */

'use client';

import { useEffect, useState, useCallback, useContext, createContext, ReactNode } from 'react';
import useSWR from 'swr';
import type { SessionUser } from '@/lib/auth';
import type { PermissionContext, PermissionCheck, ModuleMenuConfig } from '@/lib/rbac-engine';
import { rbacEngine } from '@/lib/rbac-engine';

interface AuthContextType {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  hasPermission: (check: PermissionCheck) => Promise<boolean>;
  hasAllPermissions: (checks: PermissionCheck[]) => Promise<boolean>;
  hasAnyPermission: (checks: PermissionCheck[]) => Promise<boolean>;
  getAccessibleModules: () => Promise<ModuleMenuConfig[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, isLoading, mutate } = useSWR(
    '/api/auth/session',
    async (url) => {
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) return null;
      const data = await response.json();
      return data.user;
    },
    { revalidateOnFocus: false }
  );

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    await mutate(null);
    window.location.href = '/';
  }, [mutate]);

  const hasPermission = useCallback(
    async (check: PermissionCheck): Promise<boolean> => {
      if (!session) return false;

      const context: PermissionContext = {
        userId: session.id,
        tenantId: session.tenantId,
        userRole: session.userRole,
        adminType: session.adminType,
      };

      return rbacEngine.hasPermission(context, check);
    },
    [session]
  );

  const hasAllPermissions = useCallback(
    async (checks: PermissionCheck[]): Promise<boolean> => {
      if (!session) return false;

      const context: PermissionContext = {
        userId: session.id,
        tenantId: session.tenantId,
        userRole: session.userRole,
        adminType: session.adminType,
      };

      return rbacEngine.hasAllPermissions(context, checks);
    },
    [session]
  );

  const hasAnyPermission = useCallback(
    async (checks: PermissionCheck[]): Promise<boolean> => {
      if (!session) return false;

      const context: PermissionContext = {
        userId: session.id,
        tenantId: session.tenantId,
        userRole: session.userRole,
        adminType: session.adminType,
      };

      return rbacEngine.hasAnyPermission(context, checks);
    },
    [session]
  );

  const getAccessibleModules = useCallback(
    async (): Promise<ModuleMenuConfig[]> => {
      if (!session) return [];

      const context: PermissionContext = {
        userId: session.id,
        tenantId: session.tenantId,
        userRole: session.userRole,
        adminType: session.adminType,
      };

      return rbacEngine.getAccessibleModules(context);
    },
    [session]
  );

  const value: AuthContextType = {
    user: session || null,
    isLoading,
    isAuthenticated: !!session,
    logout,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    getAccessibleModules,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

/**
 * Hook for checking a single permission
 */
export function usePermission(module: string, action: string) {
  const auth = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      setIsLoading(true);
      try {
        const result = await auth.hasPermission({ module, action });
        setHasPermission(result);
      } catch {
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (auth.isAuthenticated) {
      checkPermission();
    }
  }, [auth, module, action]);

  return { hasPermission, isLoading };
}

/**
 * Hook for getting accessible modules
 */
export function useAccessibleModules() {
  const auth = useAuth();
  const [modules, setModules] = useState<ModuleMenuConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      setIsLoading(true);
      try {
        const result = await auth.getAccessibleModules();
        setModules(result);
      } catch {
        setModules([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (auth.isAuthenticated) {
      fetchModules();
    }
  }, [auth]);

  return { modules, isLoading };
}

/**
 * Hook for protecting components with permissions
 */
export function useProtectedAction(
  module: string,
  action: string,
  fallback?: ReactNode
) {
  const { hasPermission, isLoading } = usePermission(module, action);

  return {
    canProceed: hasPermission,
    isLoading,
    fallback: !hasPermission ? fallback : null,
  };
}
