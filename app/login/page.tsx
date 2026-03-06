'use client';

import React from "react"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { apiClient } from '@/services/api-client';

// API Base URL - Update this to your backend URL
const API_BASE_URL = 'http://localhost:4000';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@system.com');
  const [password, setPassword] = useState('Admin@12345');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('auth-token') || localStorage.getItem('authToken');
    if (token) {
      router.push('/');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // Store the token and user data - backend returns { success, data: { token, user } }
      if (data.data?.token) {
        apiClient.setAuthToken(data.data.token);
        // Backward compatibility with older key usage
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('userData', JSON.stringify(data.data.user));
        localStorage.setItem('isAuthenticated', 'true');
        
        // Debug: Log the user data to console
        console.log('User logged in:', data.data.user);
        console.log('User permissions:', data.data.user?.role?.permissions);
      }

      // Redirect to dashboard
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-primary-foreground">IA</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Islamic Admin Panel</h1>
          <p className="text-muted-foreground">Enterprise multi-tenant admin system</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-accent/20">
          <CardHeader className="space-y-1 bg-card border-b border-border">
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@system.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-muted/50 border-muted-foreground/20"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="bg-muted/50 border-muted-foreground/20 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
              <p className="text-xs font-medium text-foreground mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-muted-foreground font-mono">
                <p>Email: admin@system.com</p>
                <p>Password: Admin@12345</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Production-ready enterprise admin system with RBAC
        </p>
      </div>
    </div>
  );
}
