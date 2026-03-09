/**
 * System Module Service
 * Handles system modules API calls
 */

import { apiClient } from './api-client';
import { APIResponse } from '@/lib/types';

export interface SystemModuleAction {
  key: string;
  actionName: {
    en: string;
    fr?: string;
    ar: string;
    hi?: string;
  };
  isActive: boolean;
}

export interface SystemModule {
  _id: string;
  key: string;
  moduleName: {
    en: string;
    fr?: string;
    ar: string;
    hi?: string;
  };
  description?: {
    en: string;
    fr?: string;
    ar: string;
    hi?: string;
  };
  isActive: boolean;
  actions?: SystemModuleAction[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SystemModulesFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface SystemModulesResponse {
  success: boolean;
  status: number;
  data: SystemModule[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  message?: string;
}

export interface CreateSystemModulePayload {
  key: string;
  moduleName: {
    en: string;
    fr: string;
    ar: string;
  };
  description?: {
    en: string;
    fr: string;
    ar: string;
  };
  isActive: boolean;
  actions: Array<{
    key: string;
    actionName: {
      en: string;
      fr: string;
      ar: string;
    };
    isActive: boolean;
  }>;
}

export interface UpdateSystemModulePayload {
  moduleName: {
    en: string;
    fr: string;
    ar: string;
  };
}

class SystemModuleService {
  async getModules(filters: SystemModulesFilters = {}): Promise<APIResponse<SystemModulesResponse>> {
    try {
      const params = new URLSearchParams();

      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);

      const query = params.toString();
      const endpoint = query ? `/systemmodules?${query}` : '/systemmodules';

      return await apiClient.get<SystemModulesResponse>(endpoint);
    } catch (error) {
      console.error('Error fetching system modules:', error);
      return {
        success: false,
        error: 'Failed to fetch system modules',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async createModule(payload: CreateSystemModulePayload): Promise<APIResponse<SystemModule>> {
    try {
      return await apiClient.post<SystemModule>('/systemmodules/add', payload);
    } catch (error) {
      console.error('Error creating system module:', error);
      return {
        success: false,
        error: 'Failed to create system module',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async updateModule(moduleId: string, payload: UpdateSystemModulePayload): Promise<APIResponse<SystemModule>> {
    try {
      return await apiClient.put<SystemModule>(`/systemmodules/${moduleId}`, payload);
    } catch (error) {
      console.error('Error updating system module:', error);
      return {
        success: false,
        error: 'Failed to update system module',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async deleteModule(moduleId: string): Promise<APIResponse<SystemModule>> {
    try {
      return await apiClient.delete<SystemModule>(`/systemmodules/${moduleId}`);
    } catch (error) {
      console.error('Error deleting system module:', error);
      return {
        success: false,
        error: 'Failed to delete system module',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export const systemModuleService = new SystemModuleService();
