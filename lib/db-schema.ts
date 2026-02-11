/**
 * Islamic Admin Panel - Database Schema
 * Multi-tenant RBAC system with subscription plans
 */

// ============= CORE TENANT & USER TYPES =============

export type AdminType = 'root' | 'affiliate';
export type UserRoleType = 'root-admin' | 'root-sub-admin' | 'affiliate-admin' | 'affiliate-sub-admin';

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  adminType: AdminType;
  userRole: UserRoleType;
  tenantId: string;
  parentAdminId?: string; // For sub-admins
  isActive: boolean;
  isVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  adminType: AdminType;
  rootAdminId: string; // Reference to root tenant if affiliate
  isVerified: boolean; // Blue tick for affiliates
  subscriptionPlanId?: string;
  isActive: boolean;
  settings?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// ============= PERMISSION SYSTEM =============

export interface Module {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
}

export interface Action {
  id: string;
  moduleId: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
}

export interface PermissionPackage {
  id: string;
  name: string;
  description?: string;
  packageType: 'root' | 'affiliate';
  tenantId?: string; // For affiliate-specific packages
  permissions: {
    moduleId: string;
    actionIds: string[];
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============= ROLE SYSTEM =============

export interface Role {
  id: string;
  name: string;
  description?: string;
  tenantId: string;
  permissions: {
    moduleId: string;
    actionIds: string[];
  }[];
  isSystem: boolean; // System roles can't be deleted
  createdAt: Date;
  updatedAt: Date;
}

// export interface UserRole {
//   id: string;
//   userId: string;
//   roleId: string;
//   tenantId: string;
//   assignedAt: Date;
// }

// ============= SUBSCRIPTION & AFFILIATE =============

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  permissionPackages: string[]; // PermissionPackage IDs
  features?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  status: 'active' | 'inactive' | 'canceled';
  startDate: Date;
  endDate?: Date;
  renewalDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============= CMS MANAGEMENT =============

export interface News {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  thumbnail?: string;
  authorId: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Video {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  duration?: number;
  authorId: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Challenge {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  content: string;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface ChallengeParticipant {
  id: string;
  challengeId: string;
  userId: string;
  submissionDate?: Date;
  voteCount: number;
  commentCount: number;
  status: 'enrolled' | 'submitted' | 'completed';
  createdAt: Date;
}

// ============= ADVERTISING =============

export interface Advertisement {
  id: string;
  tenantId: string;
  title: string;
  content?: string;
  imageUrl?: string;
  url?: string;
  platform: 'website' | 'app' | 'both';
  placement: 'banner' | 'sidebar' | 'featured' | 'footer';
  status: 'draft' | 'active' | 'paused' | 'archived';
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============= SUPPORT TICKETS =============

export interface SupportTicket {
  id: string;
  tenantId: string;
  ticketNumber: string;
  userId: string;
  assignedTo?: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'on_hold';
  category: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  attachments?: string[];
  isInternal: boolean;
  createdAt: Date;
}

// ============= CONTENT POLICIES =============

export interface Policy {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  content: string;
  policyType: 'privacy' | 'terms' | 'guidelines' | 'other';
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQ {
  id: string;
  tenantId: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StaticPage {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  content: string;
  metaDescription?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

// ============= AUDIT & LOGS =============

export interface AuditLog {
  id: string;
  userId: string;
  tenantId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}
