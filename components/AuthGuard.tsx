'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/services/api-client';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check localStorage for auth token
    const token = localStorage.getItem('auth-token') || localStorage.getItem('authToken');
    
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      // Redirect to login page
      router.push('/login');
    }
  }, [router]);

  // Show nothing while checking auth status
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only render children if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Check if user is authenticated
 */
export function checkAuth(): boolean {
  return !!(localStorage.getItem('auth-token') || localStorage.getItem('authToken'));
}

/**
 * Get stored auth token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('auth-token') || localStorage.getItem('authToken');
}

/**
 * Get stored user data
 */
export function getUserData(): any {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
}

/**
 * Logout function - clears auth data
 */
export function logout(): void {
  apiClient.clearAuthToken();
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  localStorage.removeItem('isAuthenticated');
}

