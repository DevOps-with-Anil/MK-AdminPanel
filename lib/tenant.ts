/**
 * Multi-Tenancy Utilities
 * Tenant isolation and context management
 */

import type { Tenant } from './db-schema';

export interface TenantContext {
  tenantId: string;
  tenantName: string;
  adminType: 'root' | 'affiliate';
  isVerified: boolean;
}

/**
 * Get tenant context for current user
 */
export async function getTenantContext(tenantId: string): Promise<TenantContext | null> {
  try {
    // TODO: Fetch from database
    // This should validate tenant exists and user has access
    return null;
  } catch {
    return null;
  }
}

/**
 * Validate tenant access
 */
export function validateTenantAccess(
  userTenantId: string,
  requestedTenantId: string
): boolean {
  // User can only access their own tenant
  return userTenantId === requestedTenantId;
}

/**
 * Build tenant-scoped query
 */
export function buildTenantQuery(
  tenantId: string,
  baseQuery: Record<string, any> = {}
): Record<string, any> {
  return {
    ...baseQuery,
    tenantId,
  };
}

/**
 * Ensure all database queries include tenant filter
 */
export class TenantFilter {
  /**
   * Filter records by tenant
   */
  static filter<T extends { tenantId?: string }>(
    records: T[],
    tenantId: string
  ): T[] {
    return records.filter(record => record.tenantId === tenantId);
  }

  /**
   * Create a scoped query builder
   */
  static scopedQuery(tenantId: string) {
    return {
      where: { tenantId },
    };
  }

  /**
   * Check if record belongs to tenant
   */
  static ownsRecord<T extends { tenantId?: string }>(
    record: T,
    tenantId: string
  ): boolean {
    return record.tenantId === tenantId;
  }
}

/**
 * Tenant hierarchy validation
 */
export class TenantHierarchy {
  /**
   * Validate parent-child tenant relationship
   */
  static isValidAffiliateChild(
    affiliateTenantId: string,
    rootTenantId: string,
    affiliateRootId?: string
  ): boolean {
    // Affiliate must have root tenant as parent
    return affiliateRootId === rootTenantId;
  }

  /**
   * Get tenant's parent
   */
  static getParentTenant(tenant: Tenant): string | null {
    return tenant.rootAdminId || null;
  }

  /**
   * Check if tenant is root
   */
  static isRootTenant(tenant: Tenant): boolean {
    return tenant.adminType === 'root';
  }

  /**
   * Check if user can manage tenant
   */
  static canManageTenant(
    userAdminType: 'root' | 'affiliate',
    userTenantId: string,
    targetTenantId: string,
    targetTenantAdminType: 'root' | 'affiliate'
  ): boolean {
    if (userAdminType === 'root') {
      // Root admin can manage all tenants
      return true;
    }

    if (userAdminType === 'affiliate') {
      // Affiliate can only manage their own tenant or their children
      return userTenantId === targetTenantId;
    }

    return false;
  }
}

/**
 * Tenant data isolation middleware
 */
export class TenantIsolation {
  /**
   * Ensure user can only access their tenant's data
   */
  static ensureTenantAccess(
    userTenantId: string,
    requestedTenantId: string
  ): boolean {
    return userTenantId === requestedTenantId;
  }

  /**
   * Filter query by tenant
   */
  static addTenantFilter(
    query: Record<string, any>,
    tenantId: string
  ): Record<string, any> {
    return {
      ...query,
      where: {
        ...query.where,
        tenantId,
      },
    };
  }

  /**
   * Scope database operations to tenant
   */
  static scopeToTenant<T extends { tenantId: string }>(
    items: T[],
    tenantId: string
  ): T[] {
    return items.filter(item => item.tenantId === tenantId);
  }
}

/**
 * Affiliate management utilities
 */
export class AffiliateUtils {
  /**
   * Create affiliate tenant
   */
  static createAffiliateTenant(
    name: string,
    slug: string,
    rootAdminId: string,
    rootTenantId: string
  ): Tenant {
    return {
      id: `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      slug,
      adminType: 'affiliate',
      rootAdminId,
      isVerified: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Verify affiliate (give blue tick)
   */
  static verifyAffiliate(tenant: Tenant): Tenant {
    return {
      ...tenant,
      isVerified: true,
      updatedAt: new Date(),
    };
  }

  /**
   * Get affiliates for root admin
   */
  static filterAffiliatesByRoot(
    affiliates: Tenant[],
    rootAdminId: string
  ): Tenant[] {
    return affiliates.filter(
      tenant => tenant.adminType === 'affiliate' && tenant.rootAdminId === rootAdminId
    );
  }

  /**
   * Check if affiliate has required subscription
   */
  static hasValidSubscription(
    tenant: Tenant,
    subscriptionStatus?: 'active' | 'inactive' | 'canceled'
  ): boolean {
    return (
      tenant.isActive &&
      tenant.subscriptionPlanId !== undefined &&
      subscriptionStatus === 'active'
    );
  }
}
