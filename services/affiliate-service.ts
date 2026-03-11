import { apiClient } from './api-client';
import { APIResponse } from '@/lib/types';

export interface AffiliateApiItem {
  _id: string;
  email: string;
  phoneCode?: string;
  phoneNumber?: string;
  website?: string;
  kybVerified?: boolean;
  companyName?: {
    en?: string;
    fr?: string;
    ar?: string;
  };
  bio?: {
    en?: string;
    fr?: string;
    ar?: string;
  };
  address?: {
    en?: string;
    fr?: string;
    ar?: string;
  };
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  name?: {
    en?: string;
    fr?: string;
    ar?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAffiliatePayload {
  email: string;
  phoneCode?: string;
  phoneNumber?: string;
  password: string;
  photo?: string;
  website?: string;
  kybVerified?: boolean;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  languages: {
    name: {
      en: string;
      fr: string;
      ar: string;
    };
    companyName?: {
      en: string;
      fr: string;
      ar: string;
    };
    bio?: {
      en: string;
      fr: string;
      ar: string;
    };
    address?: {
      en: string;
      fr: string;
      ar: string;
    };
  };
}

export interface UpdateAffiliatePayload {
  email?: string;
  phoneCode?: string;
  phoneNumber?: string;
  photo?: string;
  website?: string;
  kybVerified?: boolean;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  languages?: {
    name?: {
      en: string;
      fr: string;
      ar: string;
    };
    companyName?: {
      en: string;
      fr: string;
      ar: string;
    };
    bio?: {
      en: string;
      fr: string;
      ar: string;
    };
    address?: {
      en: string;
      fr: string;
      ar: string;
    };
  };
}

// Backend route is mounted as /api/affilaite (current project spelling)
const AFFILIATE_BASE = '/affilaite';

export async function getAffiliates(): Promise<APIResponse<{ data: AffiliateApiItem[] }>> {
  return apiClient.get(AFFILIATE_BASE);
}

export async function createAffiliate(
  payload: CreateAffiliatePayload
): Promise<APIResponse<{ data: AffiliateApiItem }>> {
  return apiClient.post(AFFILIATE_BASE, payload);
}

export async function getAffiliateById(
  id: string
): Promise<APIResponse<{ data: AffiliateApiItem }>> {
  return apiClient.get(`${AFFILIATE_BASE}/${id}`);
}

export async function updateAffiliate(
  id: string,
  payload: UpdateAffiliatePayload
): Promise<APIResponse<{ data: AffiliateApiItem }>> {
  return apiClient.put(`${AFFILIATE_BASE}/${id}`, payload);
}

export async function deleteAffiliate(id: string): Promise<APIResponse<null>> {
  return apiClient.delete(`${AFFILIATE_BASE}/${id}`);
}
