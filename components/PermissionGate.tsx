/**
 * PermissionGate Component
 * Conditionally renders content based on user permissions
 */

'use client';

import React from "react"

import { ReactNode } from 'react';
import { usePermission, useAuth } from '@/hooks/useAuth';
import type { PermissionCheck } from '@/lib/rbac-engine';

interface PermissionGateProps {
  module: string;
  action: string;
  children: ReactNode;
  fallback?: ReactNode;
  requireAll?: boolean;
}

interface MultiPermissionGateProps {
  permissions: PermissionCheck[];
  children: ReactNode;
  fallback?: ReactNode;
  requireAll?: boolean; // true = AND logic, false = OR logic
}

/**
 * Single permission gate
 */
export function PermissionGate({
  module,
  action,
  children,
  fallback = null,
  requireAll = true,
}: PermissionGateProps) {
  const { hasPermission, isLoading } = usePermission(module, action);

  if (isLoading) {
    return <div className="animate-pulse bg-muted rounded" />;
  }

  return hasPermission ? children : fallback;
}

/**
 * Multiple permissions gate with AND/OR logic
 */
export function MultiPermissionGate({
  permissions,
  children,
  fallback = null,
  requireAll = true,
}: MultiPermissionGateProps) {
  const auth = useAuth();
  const [hasPermission, setHasPermission] = require('react').useState(false);
  const [isLoading, setIsLoading] = require('react').useState(true);

  require('react').useEffect(() => {
    const checkPermissions = async () => {
      setIsLoading(true);
      try {
        const result = requireAll
          ? await auth.hasAllPermissions(permissions)
          : await auth.hasAnyPermission(permissions);
        setHasPermission(result);
      } catch {
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (auth.isAuthenticated) {
      checkPermissions();
    }
  }, [auth, permissions, requireAll]);

  if (isLoading) {
    return <div className="animate-pulse bg-muted rounded" />;
  }

  return hasPermission ? children : fallback;
}

/**
 * Permission-guarded button
 */
interface PermissionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  module: string;
  action: string;
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionButton({
  module,
  action,
  fallback,
  children,
  disabled,
  ...props
}: PermissionButtonProps) {
  const { hasPermission, isLoading } = usePermission(module, action);

  if (isLoading) {
    return <button disabled className="opacity-50 cursor-not-allowed" {...props} />;
  }

  if (!hasPermission) {
    return fallback || null;
  }

  return (
    <button disabled={disabled || isLoading} {...props}>
      {children}
    </button>
  );
}

/**
 * Admin-only gate
 */
interface AdminGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  allowedRoles?: string[];
  allowedAdminTypes?: ('root' | 'affiliate')[];
}

export function AdminGate({
  children,
  fallback = null,
  allowedRoles,
  allowedAdminTypes,
}: AdminGateProps) {
  const auth = useAuth();

  if (!auth.isAuthenticated || auth.isLoading) {
    return fallback;
  }

  // Check role
  if (allowedRoles && !allowedRoles.includes(auth.user?.userRole || '')) {
    return fallback;
  }

  // Check admin type
  if (allowedAdminTypes && !allowedAdminTypes.includes(auth.user?.adminType as any)) {
    return fallback;
  }

  return children;
}

/**
 * Root admin only gate
 */
export function RootAdminGate({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <AdminGate allowedAdminTypes={['root']} fallback={fallback}>
      {children}
    </AdminGate>
  );
}

/**
 * Affiliate admin only gate
 */
export function AffiliateAdminGate({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <AdminGate allowedAdminTypes={['affiliate']} fallback={fallback}>
      {children}
    </AdminGate>
  );
}
