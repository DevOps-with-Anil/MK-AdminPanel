  /**
 * API Client Service
 * Handles all HTTP requests with authentication, error handling, and multi-language support
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { APIResponse, PaginatedResponse, FilterOptions, SortOptions } from '@/lib/types';

class APIClient {
  private axiosInstance: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api') {
    this.baseURL = baseURL;
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Skip redirect if already on login page or if it's a navigation error
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          
          // Don't redirect if already on login page
          if (currentPath === '/login') {
            return Promise.reject(error);
          }
          
          // Check for unauthorized but don't redirect immediately if we're in the middle of a navigation
          if (error.response?.status === 401) {
            // Only redirect if we have a token (meaning it might be expired)
            const token = localStorage.getItem('auth-token') || localStorage.getItem('authToken');
            if (token) {
              console.warn('API: Unauthorized access - token may be expired');
              // Don't auto-redirect, let the component handle it
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token') || localStorage.getItem('authToken');
    }
    return null;
  }

  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', token);
    }
  }

  clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
    }
  }

  // ============= GENERIC METHODS =============

  async get<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    try {
      const response = await this.axiosInstance.get(`${endpoint}`, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    try {
      const response = await this.axiosInstance.post(`${endpoint}`, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    try {
      const response = await this.axiosInstance.put(`${endpoint}`, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    try {
      const response = await this.axiosInstance.patch(`${endpoint}`, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    try {
      const response = await this.axiosInstance.delete(`${endpoint}`, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ============= PAGINATED REQUESTS =============

  async getPaginated<T>(
    endpoint: string,
    page: number = 1,
    limit: number = 20,
    filters?: FilterOptions,
    sort?: SortOptions
  ): Promise<APIResponse<PaginatedResponse<T>>> {
    const params: any = { page, limit };

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params[key] = value;
        }
      });
    }

    if (sort) {
      params.sortBy = sort.field;
      params.sortOrder = sort.direction;
    }

    return this.get<PaginatedResponse<T>>(endpoint, { params });
  }

  // ============= ERROR HANDLING =============

  private handleError(error: any): APIResponse<any> {
    console.error('API Error:', error);

    if (axios.isAxiosError(error)) {
      const response = error.response?.data as APIResponse<any> & {
        errors?: Array<{ message?: string }>;
      };
      const status = error.response?.status;
      const validationMessage = Array.isArray(response?.errors) && response.errors.length > 0
        ? response.errors.map((item) => item?.message).filter(Boolean).join(', ')
        : '';
      const baseMessage = response?.message || response?.error || error.message || 'An error occurred';
      const composedMessage = validationMessage
        ? `${baseMessage}: ${validationMessage}`
        : baseMessage;

      return {
        success: false,
        error: response?.error || error.message,
        message: status ? `[${status}] ${composedMessage}` : composedMessage,
      };
    }

    return {
      success: false,
      error: 'Unknown error occurred',
      message: error?.message || 'An error occurred',
    };
  }
}

// Export singleton instance
export const apiClient = new APIClient();

export default apiClient;
