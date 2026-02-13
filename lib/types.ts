/**
 * Core Data Types for Enterprise Admin Panel
 * Supports multi-language fields and RBAC
 */

import { Language } from '@/i18n/translations';

// ============= MULTI-LANGUAGE TYPES =============
export interface MultiLangText {
  [key: string]: string;
}

// ============= RBAC TYPES =============
export interface Action {
  id: string;
  name: MultiLangText;
  slug: string;
  label: MultiLangText;
  module: string;
  description?: MultiLangText;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  name: MultiLangText;
  slug: string;
  description?: MultiLangText;
  icon?: string;
  order: number;
  actions: Action[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  moduleId: string;
  actionId: string;
  moduleName?: MultiLangText;
  actionName?: MultiLangText;
  createdAt: string;
}

export interface Role {
  id: string;
  name: MultiLangText;
  description?: MultiLangText;
  tenantId: string;
  adminType: 'root' | 'affiliate';
  permissions: Permission[];
  isSystem?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============= USER TYPES =============
export type AdminType = 'root-admin' | 'root-sub-admin' | 'affiliate-admin' | 'affiliate-sub-admin';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  tenantId: string;
  adminType: AdminType;
  roleId: string;
  role?: Role;
  status: UserStatus;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// ============= TENANT TYPES =============
export type TenantType = 'root' | 'affiliate';
export type SubscriptionPlanType = 'free' | 'pro' | 'enterprise';

export interface SubscriptionPlan {
  id: string;
  name: MultiLangText;
  slug: string;
  description?: MultiLangText;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  status: 'active' | 'inactive';
  features: string[];
  limits: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  name: MultiLangText;
  slug: string;
  country: string;
  website?: string;
  email: string;
  phone?: string;
  subscriptionPlanId: string;
  status: 'active' | 'inactive';
  features: string[];
  limits: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// ============= AUDIT LOG TYPES =============
export type AuditAction = 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout' | 'permission_change';

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  userName?: string;
  action: AuditAction;
  module: string;
  entityType: string;
  entityId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  changes?: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure';
  errorMessage?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

// ============= CMS TYPES =============
export interface CMSContent {
  id: string;
  title: MultiLangText;
  description?: MultiLangText;
  content: MultiLangText;
  slug: string;
  tenantId: string;
  userId: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article extends CMSContent {
  category?: string;
  tags?: string[];
  featuredImage?: string;
  author?: string;
}

export interface Challenge extends CMSContent {
  difficulty: 'easy' | 'medium' | 'hard';
  duration?: number;
  rewards?: string;
  maxParticipants?: number;
  startDate?: string;
  endDate?: string;
}

// ============= SUBSCRIPTION FEATURE TYPES =============
export interface SubscriptionFeature {
  id: string;
  name: MultiLangText;
  description?: MultiLangText;
  slug: string;
}

// ============= AFFILIATE TYPES =============
export interface Affiliate extends Tenant {
  parentTenantId: string;
  commissionRate?: number;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
}

// ============= AFFILIATE SETTINGS TYPES =============
export interface AffiliateCategory {
  id: string;
  name: MultiLangText;
  slug: string;
  description?: MultiLangText;
  icon?: string;
  order: number;
}

export interface AffiliateSettings {
  id: string;
  tenantId: string;
  categories: AffiliateCategory[];
  smtpConfig?: {
    host: string;
    port: number;
    secure: boolean;
    email: string;
  };
  domainSetup?: {
    domain: string;
    verified: boolean;
    dnsRecords?: Record<string, string>;
  };
  contactInfo: {
    email: string;
    phone: string;
    address?: string;
    city?: string;
    country?: string;
  };
  logo?: string;
  favicon?: string;
  createdAt: string;
  updatedAt: string;
}

// ============= CMS TYPES EXTENSION =============
export interface ArticleComment {
  id: string;
  articleId: string;
  userId: string;
  content: string;
  likes: number;
  createdAt: string;
}

export interface ArticleLike {
  id: string;
  articleId: string;
  userId: string;
  createdAt: string;
}

export interface ChallengeParticipant {
  id: string;
  challengeId: string;
  userId: string;
  status: 'registered' | 'started' | 'completed' | 'failed';
  joinedAt: string;
  completedAt?: string;
}

export interface ChallengeVote {
  id: string;
  challengeId: string;
  userId: string;
  value: number;
  createdAt: string;
}

export interface ChallengeLiveLink {
  id: string;
  challengeId: string;
  title: MultiLangText;
  url: string;
  status: 'scheduled' | 'live' | 'completed';
  startTime: string;
  endTime?: string;
}

// ============= END USER TYPES =============
export interface EndUserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  bio?: MultiLangText;
  interests: string[];
  certificationsCount: number;
  totalPoints: number;
  level: number;
  joinedAt: string;
  lastLoginAt?: string;
  updatedAt: string;
}

// ============= CAMPAIGN TYPES =============
export interface Campaign {
  id: string;
  title: MultiLangText;
  description: MultiLangText;
  image?: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  targetAudience: string[];
  participantsCount: number;
  createdAt: string;
  updatedAt: string;
}

// ============= OWNER VOICE TYPES =============
export interface OwnerVoice {
  id: string;
  title: MultiLangText;
  description?: MultiLangText;
  content: string;
  mediaType: 'audio' | 'video';
  mediaUrl: string;
  duration?: number;
  thumbnail?: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============= CONTACT PAGE TYPES =============
export interface ContactPageInfo {
  id: string;
  tenantId: string;
  heading: MultiLangText;
  description: MultiLangText;
  email: string;
  phone: string;
  address?: MultiLangText;
  socialLinks?: Record<string, string>;
  formFields: ContactFormField[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select';
  label: MultiLangText;
  required: boolean;
  order: number;
  options?: string[];
}

// ============= API RESPONSE TYPES =============
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============= FILTER & SORT TYPES =============
export interface FilterOptions {
  search?: string;
  status?: string;
  roleId?: string;
  tenantId?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: any;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}
