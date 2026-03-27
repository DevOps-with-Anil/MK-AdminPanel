import {
  ACTIONS,
  MOCK_USERS,
  MODULES,
  type AdminType,
  type AdminUser,
  type Permission,
} from '@/lib/mock-data';
import type { BackendPermission, User as BackendUser } from '@/types/admin.types';
import {
  BarChart3,
  Building2,
  CreditCard,
  FileCheck,
  FileText,
  LayoutDashboard,
  Lock,
  Package,
  Settings,
  ShieldCheck,
  Ticket,
  UserCircle,
  Users,
} from 'lucide-react';

export const ADMIN_USER_STORAGE_KEY = 'mk_admin_user';

export type SidebarItem = {
  labelKey: string;
  href: string;
  module: string;
  icon: typeof LayoutDashboard;
  children?: Array<{
    labelKey: string;
    href: string;
  }>;
};

const MODULE_KEY_ALIASES: Record<string, string> = {
  DASHBOARD: MODULES.DASHBOARD,
  AFFILIATES: MODULES.AFFILIATES,
  TENANTS: MODULES.TENANTS,
  PLANS: MODULES.SUBSCRIPTION_PLANS,
  SUBSCRIPTION_PLANS: MODULES.SUBSCRIPTION_PLANS,
  KYB_REQUESTS: MODULES.KYB_REQUESTS,
  BUSINESS_KYB: MODULES.BUSINESS_KYB,
  SUPPORT_TICKETS: MODULES.SUPPORT_TICKETS,
  TICKETS: MODULES.SUPPORT_TICKETS,
  ADMIN_USERS: MODULES.ADMIN_USERS,
  SYS_USERS: MODULES.ADMIN_USERS,
  SYSTEM_USERS: MODULES.ADMIN_USERS,
  ROLES_PERMISSIONS: MODULES.ROLES_PERMISSIONS,
  ROLES: MODULES.ROLES_PERMISSIONS,
  PERMISSION_PACKAGES: MODULES.PERMISSION_PACKAGES,
  MODULE_PACKAGES: MODULES.PERMISSION_PACKAGES,
  MODULES_ACTIONS: MODULES.MODULES_ACTIONS,
  ANALYTICS_REPORT: MODULES.ANALYTICS_REPORT,
  ANALYTICS: MODULES.ANALYTICS_REPORT,
  SECURITY_COMPLIANCE: MODULES.SECURITY_COMPLIANCE,
  SECURITY: MODULES.SECURITY_COMPLIANCE,
  SETTINGS: MODULES.SETTINGS,
  CMS: MODULES.CMS,
  CUSTOMERS: MODULES.CUSTOMERS,
  SUB_ADMINS: MODULES.SUB_ADMINS,
  VERIFICATION: MODULES.VERIFICATION,
  CHALLENGES: MODULES.CHALLENGES,
  PROFILE: MODULES.PROFILE,
};

const ACTION_KEY_ALIASES: Record<string, string> = {
  VIEW: ACTIONS.VIEW,
  LIST: ACTIONS.VIEW,
  READ: ACTIONS.VIEW,
  CREATE: ACTIONS.CREATE,
  ADD: ACTIONS.CREATE,
  EDIT: ACTIONS.EDIT,
  UPDATE: ACTIONS.EDIT,
  DELETE: ACTIONS.DELETE,
  REMOVE: ACTIONS.DELETE,
  EXPORT: ACTIONS.EXPORT,
};

export const ADMIN_SIDEBAR_CONFIG: Record<AdminType, SidebarItem[]> = {
  'root-admin': [
    { labelKey: 'translate.sidebar_dashboard', href: '/admin/dashboard', module: MODULES.DASHBOARD, icon: LayoutDashboard },
    { labelKey: 'translate.sidebar_tenants', href: '/admin/affiliates', module: MODULES.AFFILIATES, icon: Building2 },
    {
      labelKey: 'translate.sidebar_subscription_plans',
      href: '/admin/plans',
      module: MODULES.SUBSCRIPTION_PLANS,
      icon: CreditCard,
      children: [
        { labelKey: 'translate.sidebar_plans_list', href: '/admin/plans' },
        { labelKey: 'translate.sidebar_add_plan', href: '/admin/plans/new' },
        { labelKey: 'translate.sidebar_subscribers', href: '/admin/plans/subscribers' },
      ],
    },
    { labelKey: 'translate.sidebar_kyb_requests', href: '/admin/verification', module: MODULES.KYB_REQUESTS, icon: ShieldCheck },
    { labelKey: 'translate.sidebar_support_tickets', href: '/admin/tickets', module: MODULES.SUPPORT_TICKETS, icon: Ticket },
    {
      labelKey: 'translate.sidebar_admin_users',
      href: '/admin/users',
      module: MODULES.ADMIN_USERS,
      icon: Users,
      children: [
        { labelKey: 'translate.sidebar_system_admins', href: '/admin/users' },
        { labelKey: 'translate.sidebar_roles_management', href: '/admin/roles' },
      ],
    },
    {
      labelKey: 'translate.sidebar_permission_packages',
      href: '/admin/modules',
      module: MODULES.PERMISSION_PACKAGES,
      icon: Package,
      children: [
        { labelKey: 'translate.sidebar_root_modules', href: '/admin/modules/root-modules' },
        { labelKey: 'translate.sidebar_affiliate_modules', href: '/admin/modules/affiliate-modules' },
      ],
    },
    { labelKey: 'translate.sidebar_analytics_report', href: '/admin/analytics', module: MODULES.ANALYTICS_REPORT, icon: BarChart3 },
    { labelKey: 'translate.sidebar_security_compliance', href: '/admin/security', module: MODULES.SECURITY_COMPLIANCE, icon: Lock },
    { labelKey: 'translate.sidebar_settings', href: '/admin/settings', module: MODULES.SETTINGS, icon: Settings },
  ],
  'tenant-admin': [
    { labelKey: 'translate.sidebar_dashboard', href: '/admin/dashboard', module: MODULES.DASHBOARD, icon: LayoutDashboard },
    { labelKey: 'translate.sidebar_business_kyb', href: '/admin/verification', module: MODULES.BUSINESS_KYB, icon: FileCheck },
    { labelKey: 'translate.sidebar_subscription_plans', href: '/admin/plans', module: MODULES.SUBSCRIPTION_PLANS, icon: CreditCard },
    { labelKey: 'translate.sidebar_customers', href: '/admin/users', module: MODULES.CUSTOMERS, icon: UserCircle },
    {
      labelKey: 'translate.sidebar_cms',
      href: '/admin/cms',
      module: MODULES.CMS,
      icon: FileText,
      children: [
        { labelKey: 'translate.sidebar_contact', href: '/admin/cms/contact' },
        { labelKey: 'translate.sidebar_video', href: '/admin/videos' },
        { labelKey: 'translate.sidebar_news_articles', href: '/admin/articles' },
        { labelKey: 'translate.sidebar_challenges', href: '/admin/challenges' },
        { labelKey: 'translate.sidebar_about_us', href: '/admin/about-us' },
        { labelKey: 'translate.sidebar_home_page', href: '/admin/cms/home' },
      ],
    },
    { labelKey: 'translate.sidebar_analytics_report', href: '/admin/analytics', module: MODULES.ANALYTICS_REPORT, icon: BarChart3 },
    { labelKey: 'translate.sidebar_admin_users', href: '/admin/sub-admins', module: MODULES.ADMIN_USERS, icon: Users },
    { labelKey: 'translate.sidebar_support_tickets', href: '/admin/tickets', module: MODULES.SUPPORT_TICKETS, icon: Ticket },
    { labelKey: 'translate.sidebar_security_compliance', href: '/admin/security', module: MODULES.SECURITY_COMPLIANCE, icon: Lock },
    { labelKey: 'translate.sidebar_settings', href: '/admin/settings', module: MODULES.SETTINGS, icon: Settings },
  ],
};

export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function inferAdminType(input: {
  token?: string | null;
  roleType?: string | null;
  roleName?: string | null;
}): AdminType {
  const roleType = input.roleType ?? (decodeJwtPayload(input.token || '')?.roleType as string | undefined);
  const normalizedRoleName = input.roleName?.trim().toUpperCase();

  if (roleType?.toUpperCase() === 'ROOT' || normalizedRoleName?.includes('ROOT')) {
    return 'root-admin';
  }

  return 'tenant-admin';
}

export function normalizeModuleKey(moduleKey: string): string {
  return MODULE_KEY_ALIASES[moduleKey] || MODULE_KEY_ALIASES[moduleKey.toUpperCase()] || moduleKey.toLowerCase();
}

export function normalizeActionKey(actionKey: string): string {
  return ACTION_KEY_ALIASES[actionKey] || ACTION_KEY_ALIASES[actionKey.toUpperCase()] || actionKey.toLowerCase();
}

export function isRootUser(user?: Partial<BackendUser> | AdminUser | null): boolean {
  if (!user) return false;
  if ('type' in user && user.type === 'root-admin') return true;

  if ('roleType' in user && user.roleType?.toUpperCase() === 'ROOT') {
    return true;
  }

  return Boolean(user.role?.name?.trim().toUpperCase().includes('ROOT'));
}

function mapBackendPermissions(permissions: BackendPermission[] = []): Permission[] {
  const mappedPermissions: Permission[] = [];

  permissions.forEach((permission, index) => {
    if (!permission?.allowed) return;

    const module = normalizeModuleKey(permission.moduleKey);
    mappedPermissions.push({
      id: `module-${permission.moduleKey}-${index}`,
      module,
      action: ACTIONS.VIEW,
    });

    permission.actions?.forEach((action, actionIndex) => {
      if (!action?.allowed) return;

      mappedPermissions.push({
        id: `action-${permission.moduleKey}-${action.actionKey}-${actionIndex}`,
        module,
        action: normalizeActionKey(action.actionKey),
      });
    });
  });

  return mappedPermissions;
}

export function mapBackendUserToAdminUser(user: BackendUser, adminType?: AdminType): AdminUser {
  const resolvedAdminType =
    adminType ?? inferAdminType({ roleType: user.roleType, roleName: user.role?.name });

  return {
    id: user._id || user.id || '',
    name: user.name,
    email: user.email,
    type: resolvedAdminType,
    role: {
      id: user.role?._id || '',
      name: user.role?.name || '',
      permissions: mapBackendPermissions(user.role?.permissions),
    },
    country: 'IN',
    subscriptionPlan: resolvedAdminType === 'root-admin' ? 'enterprise' : 'pro',
    lastLogin: user.lastLoginAt
      ? new Date(user.lastLoginAt).toLocaleString()
      : MOCK_USERS[resolvedAdminType].lastLogin,
  };
}

export function readStoredAdminUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem(ADMIN_USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    localStorage.removeItem(ADMIN_USER_STORAGE_KEY);
    return null;
  }
}

export function persistAdminUser(user: AdminUser | null) {
  if (typeof window === 'undefined') return;

  if (!user) {
    localStorage.removeItem(ADMIN_USER_STORAGE_KEY);
    return;
  }

  localStorage.setItem(ADMIN_USER_STORAGE_KEY, JSON.stringify(user));
}
