/**
 * RBAC Permission Engine
 * Handles permission checking and authorization logic
 */

import type { User, Role, PermissionPackage } from './db-schema';

export interface PermissionContext {
  userId: string;
  tenantId: string;
  userRole: string;
  adminType: 'root' | 'affiliate';
}

export interface PermissionCheck {
  module: string;
  action: string;
}

export class RBACEngine {
  private permissionsCache = new Map<string, Set<string>>();
  private moduleActionMap = new Map<string, Set<string>>();

  /**
   * Check if user has permission for a specific module + action
   */
  async hasPermission(
    context: PermissionContext,
    check: PermissionCheck
  ): Promise<boolean> {
    const cacheKey = `${context.userId}:${context.tenantId}`;
    
    // Get cached permissions or fetch fresh ones
    const userPermissions = await this.getUserPermissions(context);
    const permissionKey = `${check.module}:${check.action}`;
    
    return userPermissions.has(permissionKey);
  }

  /**
   * Check multiple permissions (AND logic - all must pass)
   */
  async hasAllPermissions(
    context: PermissionContext,
    checks: PermissionCheck[]
  ): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(context);
    
    return checks.every(check => {
      const permissionKey = `${check.module}:${check.action}`;
      return userPermissions.has(permissionKey);
    });
  }

  /**
   * Check multiple permissions (OR logic - any can pass)
   */
  async hasAnyPermission(
    context: PermissionContext,
    checks: PermissionCheck[]
  ): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(context);
    
    return checks.some(check => {
      const permissionKey = `${check.module}:${check.action}`;
      return userPermissions.has(permissionKey);
    });
  }

  /**
   * Get all permissions for a user
   */
  private async getUserPermissions(
    context: PermissionContext
  ): Promise<Set<string>> {
    const cacheKey = `${context.userId}:${context.tenantId}`;
    
    if (this.permissionsCache.has(cacheKey)) {
      return this.permissionsCache.get(cacheKey)!;
    }

    // Fetch user's roles and their permissions
    const permissions = new Set<string>();
    
    // Fetch from database (mock for now)
    const userRoles = await this.fetchUserRoles(context.userId, context.tenantId);
    
    for (const role of userRoles) {
      const rolePermissions = await this.fetchRolePermissions(role.id);
      rolePermissions.forEach(perm => permissions.add(perm));
    }

    this.permissionsCache.set(cacheKey, permissions);
    return permissions;
  }

  /**
   * Get all accessible modules for a user (for menu generation)
   */
  async getAccessibleModules(
    context: PermissionContext
  ): Promise<ModuleMenuConfig[]> {
    const userPermissions = await this.getUserPermissions(context);
    const modules: Map<string, ModuleMenuConfig> = new Map();

    // Get all available modules
    const allModules = await this.fetchAllModules(context.tenantId);

    for (const module of allModules) {
      const hasModuleAccess = Array.from(userPermissions).some(perm =>
        perm.startsWith(`${module.slug}:`)
      );

      if (hasModuleAccess) {
        const actions = Array.from(userPermissions)
          .filter(perm => perm.startsWith(`${module.slug}:`))
          .map(perm => perm.split(':')[1]);

        modules.set(module.id, {
          id: module.id,
          name: module.name,
          slug: module.slug,
          icon: module.icon,
          order: module.order,
          actions: actions,
          hasAccess: true,
        });
      }
    }

    return Array.from(modules.values()).sort((a, b) => a.order - b.order);
  }

  /**
   * Clear user permissions cache
   */
  invalidateUserCache(userId: string, tenantId: string): void {
    const cacheKey = `${userId}:${tenantId}`;
    this.permissionsCache.delete(cacheKey);
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.permissionsCache.clear();
  }

  // ============= DATABASE FETCH METHODS =============
  // These should be replaced with actual database calls

  private async fetchUserRoles(
    userId: string,
    tenantId: string
  ): Promise<Role[]> {
    // TODO: Fetch from database
    return [];
  }

  private async fetchRolePermissions(roleId: string): Promise<string[]> {
    // TODO: Fetch from database
    // Returns format: 'module:action', 'module:action', etc.
    return [];
  }

  private async fetchAllModules(tenantId: string): Promise<ModuleConfig[]> {
    // TODO: Fetch from database
    return [];
  }
}

export interface ModuleConfig {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  order: number;
}

export interface ModuleMenuConfig extends ModuleConfig {
  actions: string[];
  hasAccess: boolean;
}

// Export singleton instance
export const rbacEngine = new RBACEngine();

/**
 * Helper function to format permission strings
 */
export function formatPermission(module: string, action: string): string {
  return `${module}:${action}`;
}

/**
 * Parse permission string
 */
export function parsePermission(permission: string): { module: string; action: string } {
  const [module, action] = permission.split(':');
  return { module, action };
}

/**
 * Predefined permission constants
 */
export const PERMISSIONS = {
  // Admin Users
  ADMIN_USERS_VIEW: 'admin-users:view',
  ADMIN_USERS_CREATE: 'admin-users:create',
  ADMIN_USERS_EDIT: 'admin-users:edit',
  ADMIN_USERS_DELETE: 'admin-users:delete',
  ADMIN_PROFILE_MANAGE: 'admin-users:manage-profile',

  // Roles & Permissions
  ROLES_VIEW: 'roles:view',
  ROLES_CREATE: 'roles:create',
  ROLES_EDIT: 'roles:edit',
  ROLES_DELETE: 'roles:delete',

  // Affiliate Management
  AFFILIATE_VIEW: 'affiliates:view',
  AFFILIATE_CREATE: 'affiliates:create',
  AFFILIATE_EDIT: 'affiliates:edit',
  AFFILIATE_DELETE: 'affiliates:delete',
  AFFILIATE_VERIFY: 'affiliates:verify',

  // Subscription Plans
  PLANS_VIEW: 'subscription-plans:view',
  PLANS_CREATE: 'subscription-plans:create',
  PLANS_EDIT: 'subscription-plans:edit',
  PLANS_DELETE: 'subscription-plans:delete',

  // CMS
  CMS_NEWS_VIEW: 'cms:view-news',
  CMS_NEWS_CREATE: 'cms:create-news',
  CMS_NEWS_EDIT: 'cms:edit-news',
  CMS_NEWS_DELETE: 'cms:delete-news',
  CMS_NEWS_PUBLISH: 'cms:publish-news',

  CMS_VIDEOS_VIEW: 'cms:view-videos',
  CMS_VIDEOS_CREATE: 'cms:create-videos',
  CMS_VIDEOS_EDIT: 'cms:edit-videos',
  CMS_VIDEOS_DELETE: 'cms:delete-videos',

  CMS_CHALLENGES_VIEW: 'cms:view-challenges',
  CMS_CHALLENGES_CREATE: 'cms:create-challenges',
  CMS_CHALLENGES_EDIT: 'cms:edit-challenges',
  CMS_CHALLENGES_DELETE: 'cms:delete-challenges',
  CMS_CHALLENGES_MANAGE_PARTICIPANTS: 'cms:manage-participants',

  // Advertisements
  ADS_VIEW: 'advertisements:view',
  ADS_CREATE: 'advertisements:create',
  ADS_EDIT: 'advertisements:edit',
  ADS_DELETE: 'advertisements:delete',

  // Support Tickets
  TICKETS_VIEW: 'support:view-tickets',
  TICKETS_CREATE: 'support:create-tickets',
  TICKETS_EDIT: 'support:edit-tickets',
  TICKETS_ASSIGN: 'support:assign-tickets',
  TICKETS_CLOSE: 'support:close-tickets',

  // Policies & Content
  POLICIES_VIEW: 'policies:view',
  POLICIES_CREATE: 'policies:create',
  POLICIES_EDIT: 'policies:edit',
  POLICIES_DELETE: 'policies:delete',

  FAQ_VIEW: 'faq:view',
  FAQ_CREATE: 'faq:create',
  FAQ_EDIT: 'faq:edit',
  FAQ_DELETE: 'faq:delete',
};
