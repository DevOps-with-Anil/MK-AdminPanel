/**
 * Authentication API Routes
 * POST /api/auth/login
 * POST /api/auth/logout
 * GET /api/auth/session
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAuthResponse, createLogoutResponse, getUserFromRequest } from '@/lib/middleware';

// Mock user database - replace with actual database calls
const mockUsers = [
  {
    id: 'root-1',
    email: 'admin@example.com',
    name: 'Root Admin',
    tenantId: 'root-tenant',
    adminType: 'root' as const,
    userRole: 'root-admin',
    passwordHash: 'hashed_password_here',
  },
];

export async function POST(request: NextRequest) {
  const url = new URL(request.url);

  if (url.pathname.includes('/api/auth/login')) {
    return handleLogin(request);
  }

  if (url.pathname.includes('/api/auth/logout')) {
    return handleLogout(request);
  }

  return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({ user }, { status: 200 });
}

async function handleLogin(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user (mock)
    const user = mockUsers.find(u => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // In production, verify password hash here
    // For now, accept any password for demo
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token (mock)
    const token = btoa(JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      tenantId: user.tenantId,
      adminType: user.adminType,
      userRole: user.userRole,
      iat: Date.now(),
    }));

    // Return success with token cookie
    return createAuthResponse(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          tenantId: user.tenantId,
          adminType: user.adminType,
          userRole: user.userRole,
        },
      },
      token,
      200
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleLogout(request: NextRequest) {
  return createLogoutResponse();
}
