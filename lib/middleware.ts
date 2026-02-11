/**
 * Authentication & Authorization Middleware
 * Protects routes and validates permissions
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { PermissionContext, PermissionCheck } from './rbac-engine';
import { rbacEngine } from './rbac-engine';

export interface ProtectedRouteConfig {
  allowedRoles?: string[];
  allowedAdminTypes?: ('root' | 'affiliate')[];
  requiredPermissions?: PermissionCheck[];
  requireAllPermissions?: boolean; // true = AND logic, false = OR logic
}

/**
 * Middleware to check authentication
 */
export async function withAuth(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized: No token provided' },
      { status: 401 }
    );
  }

  // Verify token (would call JWT verification)
  const session = await verifyToken(token);

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid token' },
      { status: 401 }
    );
  }

  return session;
}

/**
 * Middleware to check authorization (permissions)
 */
export async function withAuthorization(
  request: NextRequest,
  config: ProtectedRouteConfig
) {
  const token = request.cookies.get('authToken')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const session = await verifyToken(token);

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Check role restrictions
  if (config.allowedRoles && !config.allowedRoles.includes(session.userRole)) {
    return NextResponse.json(
      { error: 'Forbidden: Insufficient role' },
      { status: 403 }
    );
  }

  // Check admin type restrictions
  if (config.allowedAdminTypes && !config.allowedAdminTypes.includes(session.adminType)) {
    return NextResponse.json(
      { error: 'Forbidden: Invalid admin type' },
      { status: 403 }
    );
  }

  // Check permission requirements
  if (config.requiredPermissions && config.requiredPermissions.length > 0) {
    const context: PermissionContext = {
      userId: session.id,
      tenantId: session.tenantId,
      userRole: session.userRole,
      adminType: session.adminType,
    };

    const hasPermission = config.requireAllPermissions
      ? await rbacEngine.hasAllPermissions(context, config.requiredPermissions)
      : await rbacEngine.hasAnyPermission(context, config.requiredPermissions);

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }
  }

  return session;
}

/**
 * Tenant isolation middleware
 * Ensures users can only access their own tenant's data
 */
export function withTenantIsolation(tenantId: string, userTenantId: string) {
  if (tenantId !== userTenantId) {
    return NextResponse.json(
      { error: 'Forbidden: Access denied' },
      { status: 403 }
    );
  }
}

/**
 * Verify JWT token
 * In production, this would use a real JWT library
 */
async function verifyToken(token: string) {
  try {
    // TODO: Implement proper JWT verification
    // For now, this is a placeholder
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Extract user from request
 */
export async function getUserFromRequest(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Create auth response with token cookie
 */
export function createAuthResponse(
  data: any,
  token: string,
  status: number = 200
) {
  const response = NextResponse.json(data, { status });

  response.cookies.set({
    name: 'authToken',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  return response;
}

/**
 * Create logout response
 */
export function createLogoutResponse() {
  const response = NextResponse.json({ success: true });

  response.cookies.delete('authToken');

  return response;
}
