import { apiClient } from './api-client';
import { APIResponse } from '@/lib/types';

export interface AuditLogFilters {
  page?: number;
  limit?: number;
  search?: string;
  module?: string;
  action?: string;
  status?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface AuditLogApiItem {
  _id: string;
  user?: string;
  userEmail?: string;
  action: string;
  module: string;
  entityId?: string;
  entityName?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  status: string;
  message?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuditLogListResponse {
  success: boolean;
  status: number;
  data: AuditLogApiItem[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  message?: string;
  messageKey?: string;
}

export async function getAuditLogs(
  filters: AuditLogFilters = {}
): Promise<APIResponse<AuditLogListResponse>> {
  try {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.module) params.append('module', filters.module);
    if (filters.action) params.append('action', filters.action);
    if (filters.status) params.append('status', filters.status);
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);

    const query = params.toString();
    const endpoint = query ? `/audit-logs?${query}` : '/audit-logs';

    return await apiClient.get<AuditLogListResponse>(endpoint);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return {
      success: false,
      error: 'Failed to fetch audit logs',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

