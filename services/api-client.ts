/**
 * API Client Service
 * Handles all HTTP requests with authentication, error handling, and multi-language support
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { APIResponse, PaginatedResponse, FilterOptions, SortOptions } from '@/lib/types';

class APIClient {
  private axiosInstance: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api') {
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
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token');
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
      const response = error.response?.data as APIResponse<any>;
      return {
        success: false,
        error: response?.error || error.message,
        message: response?.message || 'An error occurred',
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
