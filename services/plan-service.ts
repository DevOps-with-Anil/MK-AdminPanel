import { apiClient } from './api-client';
import { APIResponse } from '@/lib/types';

interface MultiLangText {
  en: string;
  fr: string;
  ar: string;
}

export interface CreatePlanPayload {
  name: MultiLangText;
  description?: MultiLangText;
  price: number;
  currency: string;
  duration: 'MONTHLY' | 'YEARLY';
  status?: 'ACTIVE' | 'INACTIVE';
}

export async function createPlan(payload: CreatePlanPayload): Promise<APIResponse<any>> {
  return apiClient.post('/plans', payload);
}

export interface UpdatePlanPayload {
  name?: MultiLangText;
  description?: MultiLangText;
  price?: number;
  currency?: string;
  duration?: 'MONTHLY' | 'YEARLY';
  status?: 'ACTIVE' | 'INACTIVE';
}

export async function getPlans(): Promise<APIResponse<any>> {
  return apiClient.get('/plans');
}

export async function updatePlan(id: string, payload: UpdatePlanPayload): Promise<APIResponse<any>> {
  return apiClient.put(`/plans/${id}`, payload);
}

export async function deletePlan(id: string): Promise<APIResponse<any>> {
  return apiClient.delete(`/plans/${id}`);
}
