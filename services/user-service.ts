/**
 * User Service
 * Handles system users API calls
 */

import { apiClient } from './api-client';
import { 
  SystemUser, 
  SystemUserFilters, 
  SystemUsersResponse,
  APIResponse,
  CreateSystemUserPayload,
  SystemRoleOption
} from '@/lib/types';

class UserService {
  /**
   * Get paginated list of system users
   * Endpoint: GET /api/systemusers
   * Access: Private (Requires SYS_ADMINS - SYS_ADMIN_VIEW permission)
   */
  async getSystemUsers(filters: SystemUserFilters = {}): Promise<APIResponse<SystemUsersResponse>> {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.roleId) params.append('roleId', filters.roleId);
      if (filters.country) params.append('country', filters.country);

      const queryString = params.toString();
      const endpoint = queryString ? `/systemusers?${queryString}` : '/systemusers';

      const response = await apiClient.get<SystemUsersResponse>(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching system users:', error);
      return {
        success: false,
        error: 'Failed to fetch users',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Create a new system user
   * Endpoint: POST /api/systemusers
   */
  async createUser(userData: CreateSystemUserPayload): Promise<APIResponse<SystemUser>> {
    try {
      const requestBody = {
        ...userData,
        roleId: userData.role,
      };

      const response = await apiClient.post<SystemUser>('/systemusers', requestBody);
      return response;
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        error: 'Failed to create user',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get available roles for user creation
   * Endpoint: GET /api/roles
   */
  async getSystemRoles(): Promise<APIResponse<SystemRoleOption[]>> {
    try {
      const response = await apiClient.get<SystemRoleOption[]>('/roles?page=1&limit=100&status=true');
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
   * Update an existing system user
   * Endpoint: POST /api/systemusers/:id
   */
  async updateUser(userId: string, userData: Partial<SystemUser>): Promise<APIResponse<SystemUser>> {
    try {
      const response = await apiClient.post<SystemUser>(`/systemusers/${userId}`, userData);
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        error: 'Failed to update user',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Update currently logged-in user profile (self)
   * Endpoint: POST /api/profile/me
   */
  async updateMyProfile(data: { name?: string; email?: string }): Promise<APIResponse<SystemUser>> {
    try {
      const response = await apiClient.post<SystemUser>('/profile/me', data);
      return response;
    } catch (error) {
      console.error('Error updating my profile:', error);
      return {
        success: false,
        error: 'Failed to update profile',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Delete a system user
   * Endpoint: DELETE /api/systemusers/:id
   */
  async deleteUser(userId: string): Promise<APIResponse<void>> {
    try {
      const response = await apiClient.delete<void>(`/systemusers/${userId}`);
      return response;
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        error: 'Failed to delete user',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Reset a user's password
   * Endpoint: POST /api/systemusers/:id/reset-password
   */
  async resetPassword(userId: string, newPassword: string): Promise<APIResponse<void>> {
    try {
      const response = await apiClient.post<void>(`/systemusers/${userId}/reset-password`, { newPassword });
      return response;
    } catch (error) {
      console.error('Error resetting password:', error);
      return {
        success: false,
        error: 'Failed to reset password',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

// Export singleton instance
export const userService = new UserService();

export default userService;

