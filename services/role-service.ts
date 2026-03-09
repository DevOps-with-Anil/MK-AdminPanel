/**
 * Role Service
 * Handles system roles API calls
 */

import { apiClient } from './api-client';
import {
  SystemRole,
  SystemRoleFilters,
  SystemRolesResponse,
  APIResponse,
} from '@/lib/types';

class RoleService {
  /**
   * Get paginated list of roles
   * Endpoint: GET /api/roles
   * Access: Private (Requires SYS_ROLES - SYS_ROLE_VIEW permission)
   */
  async getRoles(filters: SystemRoleFilters = {}): Promise<APIResponse<SystemRolesResponse>> {
    try {
      // Build query parameters
      const params = new URLSearchParams();

      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status.toString());

      const queryString = params.toString();
      const endpoint = queryString ? `/roles?${queryString}` : '/roles';

      // Use GET method for listing roles
      const response = await apiClient.get<SystemRolesResponse>(endpoint);
      
      return response;
    } catch (error) {
      console.error('Error fetching roles:', error);
      return {
        success: false,
        error: 'Failed to fetch roles',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get all active roles (for dropdowns)
   * Endpoint: GET /api/roles
   */
  async getActiveRoles(): Promise<APIResponse<SystemRolesResponse>> {
    try {
      const response = await apiClient.get<SystemRolesResponse>('/roles?page=1&limit=100&status=true');
      return response;
    } catch (error) {
      console.error('Error fetching active roles:', error);
      return {
        success: false,
        error: 'Failed to fetch active roles',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Create a new role
   * Endpoint: POST /api/roles
   */
  async createRole(roleData: {
    name: { en: string; fr: string; ar: string };
    description?: { en: string; fr: string; ar: string };
  }): Promise<APIResponse<SystemRole>> {
    try {
      const response = await apiClient.post<SystemRole>('/roles', roleData);
      return response;
    } catch (error) {
      console.error('Error creating role:', error);
      return {
        success: false,
        error: 'Failed to create role',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Update an existing role
   * Endpoint: PUT /api/roles/:id
   */
  async updateRole(
    roleId: string,
    roleData: {
      name?: { en: string; fr: string; ar: string };
      description?: { en: string; fr: string; ar: string };
    }
  ): Promise<APIResponse<SystemRole>> {
    try {
      const response = await apiClient.put<SystemRole>(`/roles/${roleId}`, roleData);
      return response;
    } catch (error) {
      console.error('Error updating role:', error);
      return {
        success: false,
        error: 'Failed to update role',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Update role status
   * Endpoint: PATCH /api/roles/:id/status
   */
  async updateRoleStatus(roleId: string, status: boolean): Promise<APIResponse<SystemRole>> {
    try {
      const response = await apiClient.patch<SystemRole>(`/roles/${roleId}/status`, { status });
      return response;
    } catch (error) {
      console.error('Error updating role status:', error);
      return {
        success: false,
        error: 'Failed to update role status',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Assign permissions to role
   * Endpoint: PATCH /api/roles/:id/permissions
   */
  async assignPermissions(
    roleId: string,
    modules: Array<{
      moduleKey: string;
      actions: Array<{
        actionKey: string;
        allowed: boolean;
      }>;
    }>
  ): Promise<APIResponse<SystemRole>> {
    try {
      const response = await apiClient.patch<SystemRole>(`/roles/${roleId}/permissions`, { modules });
      return response;
    } catch (error) {
      console.error('Error assigning permissions:', error);
      return {
        success: false,
        error: 'Failed to assign permissions',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

// Export singleton instance
export const roleService = new RoleService();

export default roleService;
