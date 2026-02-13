/**
 * RBAC Service
 * Handles all RBAC-related API calls for Modules, Actions, Roles, and Permissions
 */

import { apiClient } from './api-client';
import {
  Module,
  Action,
  Role,
  Permission,
  APIResponse,
  PaginatedResponse,
  FilterOptions,
} from '@/lib/types';

// ============= MODULE SERVICES =============

export const moduleService = {
  // Get all modules
  async getAll(tenantId: string): Promise<APIResponse<Module[]>> {
    return apiClient.get(`/modules?tenantId=${tenantId}`);
  },

  // Get paginated modules
  async getPaginated(
    tenantId: string,
    page: number = 1,
    limit: number = 20,
    filters?: FilterOptions
  ): Promise<APIResponse<PaginatedResponse<Module>>> {
    const params = new URLSearchParams();
    params.append('tenantId', tenantId);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    if (filters?.search) params.append('search', filters.search);

    return apiClient.get(`/modules?${params.toString()}`);
  },

  // Get single module
  async getById(id: string): Promise<APIResponse<Module>> {
    return apiClient.get(`/modules/${id}`);
  },

  // Create module
  async create(tenantId: string, data: Partial<Module>): Promise<APIResponse<Module>> {
    return apiClient.post(`/modules`, {
      ...data,
      tenantId,
    });
  },

  // Update module
  async update(id: string, data: Partial<Module>): Promise<APIResponse<Module>> {
    return apiClient.put(`/modules/${id}`, data);
  },

  // Delete module
  async delete(id: string): Promise<APIResponse<void>> {
    return apiClient.delete(`/modules/${id}`);
  },

  // Reorder modules
  async reorder(tenantId: string, moduleIds: string[]): Promise<APIResponse<Module[]>> {
    return apiClient.post(`/modules/reorder`, {
      tenantId,
      moduleIds,
    });
  },
};

// ============= ACTION SERVICES =============

export const actionService = {
  // Get all actions for a module
  async getByModule(moduleId: string): Promise<APIResponse<Action[]>> {
    return apiClient.get(`/actions?moduleId=${moduleId}`);
  },

  // Get single action
  async getById(id: string): Promise<APIResponse<Action>> {
    return apiClient.get(`/actions/${id}`);
  },

  // Create action
  async create(moduleId: string, data: Partial<Action>): Promise<APIResponse<Action>> {
    return apiClient.post(`/actions`, {
      ...data,
      moduleId,
    });
  },

  // Update action
  async update(id: string, data: Partial<Action>): Promise<APIResponse<Action>> {
    return apiClient.put(`/actions/${id}`, data);
  },

  // Delete action
  async delete(id: string): Promise<APIResponse<void>> {
    return apiClient.delete(`/actions/${id}`);
  },

  // Reorder actions
  async reorder(moduleId: string, actionIds: string[]): Promise<APIResponse<Action[]>> {
    return apiClient.post(`/actions/reorder`, {
      moduleId,
      actionIds,
    });
  },
};

// ============= ROLE SERVICES =============

export const roleService = {
  // Get all roles
  async getAll(tenantId: string): Promise<APIResponse<Role[]>> {
    return apiClient.get(`/roles?tenantId=${tenantId}`);
  },

  // Get paginated roles
  async getPaginated(
    tenantId: string,
    page: number = 1,
    limit: number = 20,
    filters?: FilterOptions
  ): Promise<APIResponse<PaginatedResponse<Role>>> {
    const params = new URLSearchParams();
    params.append('tenantId', tenantId);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);

    return apiClient.get(`/roles?${params.toString()}`);
  },

  // Get single role
  async getById(id: string): Promise<APIResponse<Role>> {
    return apiClient.get(`/roles/${id}`);
  },

  // Create role
  async create(tenantId: string, data: Partial<Role>): Promise<APIResponse<Role>> {
    return apiClient.post(`/roles`, {
      ...data,
      tenantId,
    });
  },

  // Update role
  async update(id: string, data: Partial<Role>): Promise<APIResponse<Role>> {
    return apiClient.put(`/roles/${id}`, data);
  },

  // Delete role
  async delete(id: string): Promise<APIResponse<void>> {
    return apiClient.delete(`/roles/${id}`);
  },

  // Assign permissions to role
  async assignPermissions(
    roleId: string,
    permissionIds: string[]
  ): Promise<APIResponse<Role>> {
    return apiClient.post(`/roles/${roleId}/permissions`, {
      permissionIds,
    });
  },

  // Remove permission from role
  async removePermission(roleId: string, permissionId: string): Promise<APIResponse<Role>> {
    return apiClient.delete(`/roles/${roleId}/permissions/${permissionId}`);
  },

  // Clone role
  async clone(roleId: string, newName: string, tenantId: string): Promise<APIResponse<Role>> {
    return apiClient.post(`/roles/${roleId}/clone`, {
      name: newName,
      tenantId,
    });
  },
};

// ============= PERMISSION SERVICES =============

export const permissionService = {
  // Get all permissions
  async getAll(tenantId: string): Promise<APIResponse<Permission[]>> {
    return apiClient.get(`/permissions?tenantId=${tenantId}`);
  },

  // Get permissions by role
  async getByRole(roleId: string): Promise<APIResponse<Permission[]>> {
    return apiClient.get(`/permissions?roleId=${roleId}`);
  },

  // Get permissions by user
  async getByUser(userId: string): Promise<APIResponse<Permission[]>> {
    return apiClient.get(`/permissions?userId=${userId}`);
  },

  // Check single permission
  async check(
    userId: string,
    moduleId: string,
    actionId: string
  ): Promise<APIResponse<{ hasPermission: boolean }>> {
    return apiClient.get(
      `/permissions/check?userId=${userId}&moduleId=${moduleId}&actionId=${actionId}`
    );
  },

  // Create permission (maps module + action)
  async create(moduleId: string, actionId: string): Promise<APIResponse<Permission>> {
    return apiClient.post(`/permissions`, {
      moduleId,
      actionId,
    });
  },

  // Delete permission
  async delete(permissionId: string): Promise<APIResponse<void>> {
    return apiClient.delete(`/permissions/${permissionId}`);
  },

  // Bulk create permissions
  async bulkCreate(
    moduleId: string,
    actionIds: string[]
  ): Promise<APIResponse<Permission[]>> {
    return apiClient.post(`/permissions/bulk`, {
      moduleId,
      actionIds,
    });
  },
};

// ============= COMBINED SERVICES =============

/**
 * Get complete RBAC structure with all modules, actions, and their relationships
 */
export async function getRBACStructure(tenantId: string): Promise<APIResponse<{
  modules: Module[];
  actions: Action[];
}>> {
  try {
    const [modulesRes, actionsRes] = await Promise.all([
      moduleService.getAll(tenantId),
      apiClient.get(`/actions?tenantId=${tenantId}`),
    ]);

    if (!modulesRes.success || !actionsRes.success) {
      return {
        success: false,
        error: 'Failed to fetch RBAC structure',
      };
    }

    return {
      success: true,
      data: {
        modules: modulesRes.data || [],
        actions: actionsRes.data || [],
      },
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error fetching RBAC structure',
    };
  }
}

/**
 * Get permission matrix for a role (all modules + actions with role permissions marked)
 */
export async function getPermissionMatrix(
  tenantId: string,
  roleId: string
): Promise<APIResponse<{
  matrix: Array<{
    moduleId: string;
    moduleName: string;
    actions: Array<{
      actionId: string;
      actionName: string;
      hasPermission: boolean;
    }>;
  }>;
}>> {
  try {
    const [rbacRes, roleRes] = await Promise.all([
      getRBACStructure(tenantId),
      roleService.getById(roleId),
    ]);

    if (!rbacRes.success || !roleRes.success) {
      return {
        success: false,
        error: 'Failed to fetch permission matrix',
      };
    }

    const modules = rbacRes.data?.modules || [];
    const rolePermissions = roleRes.data?.permissions || [];
    const permissionSet = new Set(
      rolePermissions.map(p => `${p.moduleId}:${p.actionId}`)
    );

    const matrix = modules.map(module => ({
      moduleId: module.id,
      moduleName: module.name.en || module.name['hi'] || '',
      actions: (module.actions || []).map(action => ({
        actionId: action.id,
        actionName: action.name.en || action.name['hi'] || '',
        hasPermission: permissionSet.has(`${module.id}:${action.id}`),
      })),
    }));

    return {
      success: true,
      data: { matrix },
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error fetching permission matrix',
    };
  }
}
