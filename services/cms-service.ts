import { apiClient } from './api-client';
import {
  APIResponse,
  CMSFilters,
  CMSItem,
  CMSListResponse,
  CreateCMSPayload,
  UpdateCMSPayload,
} from '@/lib/types';

class CMSService {
  async getCMSItems(filters: CMSFilters = {}): Promise<APIResponse<CMSListResponse>> {
    try {
      const params = new URLSearchParams();

      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);

      const queryString = params.toString();
      const endpoint = queryString ? `/cms?${queryString}` : '/cms';
      return await apiClient.get<CMSListResponse>(endpoint);
    } catch (error) {
      console.error('Error fetching CMS items:', error);
      return {
        success: false,
        error: 'Failed to fetch CMS items',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getCMSItemById(id: string): Promise<APIResponse<CMSItem>> {
    try {
      return await apiClient.get<CMSItem>(`/cms/${id}`);
    } catch (error) {
      console.error('Error fetching CMS item:', error);
      return {
        success: false,
        error: 'Failed to fetch CMS item',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async createCMSItem(payload: CreateCMSPayload): Promise<APIResponse<CMSItem>> {
    try {
      return await apiClient.post<CMSItem>('/cms', payload);
    } catch (error) {
      console.error('Error creating CMS item:', error);
      return {
        success: false,
        error: 'Failed to create CMS item',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async updateCMSItem(id: string, payload: UpdateCMSPayload): Promise<APIResponse<CMSItem>> {
    try {
      return await apiClient.put<CMSItem>(`/cms/${id}`, payload);
    } catch (error) {
      console.error('Error updating CMS item:', error);
      return {
        success: false,
        error: 'Failed to update CMS item',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async deleteCMSItem(id: string): Promise<APIResponse<{ _id: string }>> {
    try {
      return await apiClient.delete<{ _id: string }>(`/cms/${id}`);
    } catch (error) {
      console.error('Error deleting CMS item:', error);
      return {
        success: false,
        error: 'Failed to delete CMS item',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export const cmsService = new CMSService();
export default cmsService;
