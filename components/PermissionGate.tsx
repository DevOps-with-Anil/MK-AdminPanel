/**
 * PermissionGate Component
 * Conditionally renders content based on user permissions and subscription features
 */

'use client';

import React from 'react';
import { ReactNode } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Lock, Crown, Zap } from 'lucide-react';

interface PermissionGateProps {
  module: string;
  action?: string;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
}

interface FeatureGateProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
  requiredPlan?: 'pro' | 'enterprise';
}

interface PlanGateProps {
  requiredPlan: 'pro' | 'enterprise';
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Single permission gate - checks both subscription plan AND role permissions
 */
export function PermissionGate({
  module,
  action = 'view',
  children,
  fallback = null,
  showUpgradePrompt = false,
}: PermissionGateProps) {
  const { hasPermission, canAccessModule, subscriptionPlan } = useAdmin();

  // First check if the module is accessible based on subscription plan
  if (!canAccessModule(module)) {
    if (showUpgradePrompt) {
      return (
        <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
          <div className="flex items-center gap-2 text-amber-800">
            <Lock size={16} />
            <span className="font-medium">Upgrade Required</span>
          </div>
          <p className="text-sm text-amber-700 mt-1">
            This feature is not available on your {subscriptionPlan} plan.
          </p>
        </div>
      );
    }
    return fallback;
  }

  // Then check role permissions
  if (!hasPermission(module, action)) {
    return fallback;
  }

  return <>{children}</>;
}

/**
 * Feature gate - checks subscription plan features only
 */
export function FeatureGate({
  feature,
  children,
  fallback = null,
  showUpgradePrompt = false,
  requiredPlan,
}: FeatureGateProps) {
  const { hasFeature, subscriptionPlan } = useAdmin();

  // Check if the feature is available in the subscription plan
  const hasAccess = hasFeature(feature);

  if (!hasAccess) {
    if (showUpgradePrompt) {
      return (
        <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
          <div className="flex items-center gap-2 text-amber-800">
            <Lock size={16} />
            <span className="font-medium">Upgrade Required</span>
          </div>
          <p className="text-sm text-amber-700 mt-1">
            This feature requires a {requiredPlan || 'higher'} plan. 
            Your current plan: {subscriptionPlan}.
          </p>
        </div>
      );
    }
    return fallback;
  }

  return <>{children}</>;
}

/**
 * Plan gate - restricts access based on subscription plan level
 */
export function PlanGate({
  requiredPlan,
  children,
  fallback = null,
}: PlanGateProps) {
  const { subscriptionPlan } = useAdmin();

  // Define plan hierarchy
  const planLevel: Record<string, number> = {
    free: 0,
    pro: 1,
    enterprise: 2,
  };

  const currentLevel = planLevel[subscriptionPlan] || 0;
  const requiredLevel = planLevel[requiredPlan] || 1;

  if (currentLevel < requiredLevel) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Pro only gate
 */
export function ProGate({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return <PlanGate requiredPlan="pro">{children}</PlanGate>;
}

/**
 * Enterprise only gate
 */
export function EnterpriseGate({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return <PlanGate requiredPlan="enterprise">{children}</PlanGate>;
}

/**
 * Upgrade prompt component - shows upgrade message with plan icon
 */
export function UpgradePrompt({
  plan = 'pro',
  message,
}: {
  plan?: 'pro' | 'enterprise';
  message?: string;
}) {
  const { subscriptionPlan } = useAdmin();

  const planConfig = {
    pro: {
      icon: Zap,
      color: 'blue',
      name: 'Pro',
    },
    enterprise: {
      icon: Crown,
      color: 'purple',
      name: 'Enterprise',
    },
  };

  const config = planConfig[plan];
  const Icon = config.icon;

  return (
    <div className={`p-4 border rounded-lg ${
      config.color === 'purple' 
        ? 'border-purple-200 bg-purple-50' 
        : 'border-blue-200 bg-blue-50'
    }`}>
      <div className={`flex items-center gap-2 ${
        config.color === 'purple' ? 'text-purple-800' : 'text-blue-800'
      }`}>
        <Icon size={16} />
        <span className="font-medium">Upgrade to {config.name}</span>
      </div>
      <p className={`text-sm mt-1 ${
        config.color === 'purple' ? 'text-purple-700' : 'text-blue-700'
      }`}>
        {message || `This feature is available on the ${config.name} plan. Your current plan: ${subscriptionPlan}.`}
      </p>
    </div>
  );
}

/**
 * Permission-guarded button wrapper
 */
interface GuardedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  module: string;
  action?: string;
  children: ReactNode;
}

export function GuardedButton({
  module,
  action = 'view',
  children,
  disabled,
  className,
  ...props
}: GuardedButtonProps) {
  const { hasPermission, canAccessModule } = useAdmin();

  const canAccess = canAccessModule(module) && hasPermission(module, action);

  return (
    <button
      disabled={disabled || !canAccess}
      className={`${className} ${!canAccess ? 'opacity-50 cursor-not-allowed' : ''}`}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Admin type gate
 */
interface AdminTypeGateProps {
  allowedTypes: Array<'root-admin' | 'root-sub-admin' | 'affiliate-admin' | 'affiliate-sub-admin'>;
  children: ReactNode;
  fallback?: ReactNode;
}

export function AdminTypeGate({
  allowedTypes,
  children,
  fallback = null,
}: AdminTypeGateProps) {
  const { currentAdminType } = useAdmin();

  if (!allowedTypes.includes(currentAdminType)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Root admin gate
 */
export function RootAdminGate({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <AdminTypeGate allowedTypes={['root-admin', 'root-sub-admin']}>
      {children}
    </AdminTypeGate>
  );
}

/**
 * Affiliate admin gate
 */
export function AffiliateAdminGate({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <AdminTypeGate allowedTypes={['affiliate-admin', 'affiliate-sub-admin']}>
      {children}
    </AdminTypeGate>
  );
}

