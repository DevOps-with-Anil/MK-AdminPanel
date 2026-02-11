/**
 * Permission Manager
 * Advanced permission handling and permission package management
 */

import type {
  PermissionPackage,
  Module,
  Action,
  Role,
} from './db-schema';

export interface PermissionSet {
  moduleId: string;
  actions: string[];
}

export interface PermissionDiff {
  added: string[];
  removed: string[];
  unchanged: string[];
}

export class PermissionManager {
  /**
   * Create a permission package
   */
  static createPermissionPackage(
    name: string,
    packageType: 'root' | 'affiliate',
    permissions: PermissionSet[],
    description?: string
  ): PermissionPackage {
    return {
      id: this.generateId(),
      name,
      description,
      packageType,
      permissions,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Merge multiple permission packages
   */
  static mergePermissions(...packages: PermissionPackage[]): PermissionSet[] {
    const merged = new Map<string, Set<string>>();

    for (const pkg of packages) {
      for (const perm of pkg.permissions) {
        if (!merged.has(perm.moduleId)) {
          merged.set(perm.moduleId, new Set());
        }
        perm.actionIds.forEach(actionId => {
          merged.get(perm.moduleId)!.add(actionId);
        });
      }
    }

    return Array.from(merged.entries()).map(([moduleId, actionIds]) => ({
      moduleId,
      actions: Array.from(actionIds),
    }));
  }

  /**
   * Filter permissions by role type
   * Root admins can only see/assign root-level permissions
   * Affiliate admins limited to their plan's permissions
   */
  static filterPermissionsByRole(
    permissions: PermissionSet[],
    userRole: string,
    allowedPermissions?: PermissionSet[]
  ): PermissionSet[] {
    if (userRole === 'root-admin' || userRole === 'root-sub-admin') {
      // Root admins see all permissions
      return permissions;
    }

    // Affiliate admins only see allowed permissions from their plan
    if (!allowedPermissions) {
      return [];
    }

    return permissions.filter(perm =>
      allowedPermissions.some(allowed => allowed.moduleId === perm.moduleId)
    );
  }

  /**
   * Compare two permission sets
   */
  static comparePermissions(
    before: PermissionSet[],
    after: PermissionSet[]
  ): PermissionDiff {
    const beforeMap = this.toMap(before);
    const afterMap = this.toMap(after);

    const added: string[] = [];
    const removed: string[] = [];
    const unchanged: string[] = [];

    // Check all permissions in 'after'
    for (const [key] of afterMap) {
      if (!beforeMap.has(key)) {
        added.push(key);
      } else if (beforeMap.get(key) === afterMap.get(key)) {
        unchanged.push(key);
      }
    }

    // Check for removed permissions
    for (const [key] of beforeMap) {
      if (!afterMap.has(key)) {
        removed.push(key);
      }
    }

    return { added, removed, unchanged };
  }

  /**
   * Validate permission package
   */
  static validatePermissionPackage(
    pkg: PermissionPackage,
    availableModules: Module[],
    availableActions: Action[]
  ): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const moduleIds = new Set(availableModules.map(m => m.id));
    const actionIds = new Set(availableActions.map(a => a.id));

    for (const perm of pkg.permissions) {
      if (!moduleIds.has(perm.moduleId)) {
        errors.push(`Invalid module ID: ${perm.moduleId}`);
      }

      for (const actionId of perm.actionIds) {
        if (!actionIds.has(actionId)) {
          errors.push(`Invalid action ID: ${actionId}`);
        }
      }
    }

    if (pkg.name.trim().length === 0) {
      errors.push('Permission package name is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get inherited permissions for a role hierarchy
   */
  static getInheritedPermissions(
    role: Role,
    parentPermissions?: PermissionSet[]
  ): PermissionSet[] {
    const result = new Map<string, Set<string>>();

    // Add parent permissions first
    if (parentPermissions) {
      for (const perm of parentPermissions) {
        result.set(perm.moduleId, new Set(perm.actions));
      }
    }

    // Add role's own permissions
    for (const perm of role.permissions) {
      if (!result.has(perm.moduleId)) {
        result.set(perm.moduleId, new Set());
      }
      perm.actionIds.forEach(actionId => {
        result.get(perm.moduleId)!.add(actionId);
      });
    }

    return Array.from(result.entries()).map(([moduleId, actionIds]) => ({
      moduleId,
      actions: Array.from(actionIds),
    }));
  }

  /**
   * Check if user can perform an action on a resource
   */
  static canPerformAction(
    userPermissions: PermissionSet[],
    moduleId: string,
    actionId: string
  ): boolean {
    const modulePerm = userPermissions.find(p => p.moduleId === moduleId);
    return modulePerm ? modulePerm.actions.includes(actionId) : false;
  }

  /**
   * Get permission summary for display
   */
  static getPermissionSummary(permissions: PermissionSet[]): {
    totalModules: number;
    totalActions: number;
    summary: string;
  } {
    const totalModules = permissions.length;
    const totalActions = permissions.reduce((sum, p) => sum + p.actions.length, 0);

    const moduleNames = permissions.map(p => `${p.moduleId} (${p.actions.length} actions)`).join(', ');

    return {
      totalModules,
      totalActions,
      summary: moduleNames,
    };
  }

  // ============= PRIVATE HELPERS =============

  private static toMap(
    permissions: PermissionSet[]
  ): Map<string, string> {
    const map = new Map<string, string>();
    for (const perm of permissions) {
      map.set(perm.moduleId, perm.actions.sort().join(','));
    }
    return map;
  }

  private static generateId(): string {
    return `pkg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Permission validation schema
 */
export const PERMISSION_RULES = {
  ROOT_ONLY_MODULES: [
    'affiliates',
    'subscription-plans',
    'system-settings',
  ],

  AFFILIATE_RESTRICTED_MODULES: [
    'admin-users', // Can only manage sub-admins
    'roles', // Can only create roles within their plan
    'cms',
    'advertisements',
    'support',
  ],

  MODULE_ACTION_MAP: {
    'admin-users': ['view', 'create', 'edit', 'delete', 'manage-profile'],
    'roles': ['view', 'create', 'edit', 'delete'],
    'affiliates': ['view', 'create', 'edit', 'delete', 'verify'],
    'subscription-plans': ['view', 'create', 'edit', 'delete'],
    'cms': [
      'view-news',
      'create-news',
      'edit-news',
      'delete-news',
      'publish-news',
      'view-videos',
      'create-videos',
      'edit-videos',
      'delete-videos',
      'view-challenges',
      'create-challenges',
      'edit-challenges',
      'delete-challenges',
      'manage-participants',
    ],
    'advertisements': ['view', 'create', 'edit', 'delete'],
    'support': ['view-tickets', 'create-tickets', 'edit-tickets', 'assign-tickets', 'close-tickets'],
    'policies': ['view', 'create', 'edit', 'delete'],
  },
};
