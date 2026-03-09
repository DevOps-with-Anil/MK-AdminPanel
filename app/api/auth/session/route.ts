/**
 * Session API Route
 * GET /api/auth/session
 * Returns current user session based on stored token
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies or localStorage via header
    const token = request.cookies.get('authToken')?.value;

    // Also check for token in Authorization header
    const authHeader = request.headers.get('Authorization');
    const bearerToken = authHeader?.replace('Bearer ', '');

    const validToken = token || bearerToken;

    if (!validToken) {
      return NextResponse.json(
        { success: false, user: null, message: 'No token provided' },
        { status: 401 }
      );
    }

    // Try to get user data from localStorage (client-side stored)
    // In a real app, you would validate the token with the backend
    // For now, we'll return a mock response based on stored user data
    
    // Note: In Next.js server components, we can't access localStorage directly
    // This is handled client-side via the AuthGuard component
    
    return NextResponse.json({
      success: true,
      user: null,
      message: 'Token found - client-side validation required',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, user: null, message: 'Invalid token' },
      { status: 401 }
    );
  }
}

