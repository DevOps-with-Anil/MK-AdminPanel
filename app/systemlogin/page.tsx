'use client';

import React from "react"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { getAuthToken, loginRootAdmin, setAuthToken } from '@/lib/client-auth';

export default function SystemLoginPage() {
  const router = useRouter();
  const { setAdminType } = useAdmin();
  const [email, setEmail] = useState('admin@system.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (getAuthToken()) {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const token = await loginRootAdmin({ email, password });

      setAuthToken(token);
      setAdminType('root-admin');
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <ShieldCheck className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">System Administration</h1>
          <p className="text-slate-400">Root Access Portal</p>
        </div>

        {/* Login Card */}
        <Card className="border-slate-800 bg-slate-900 shadow-2xl">
          <CardHeader className="space-y-1 border-b border-slate-800">
            <CardTitle className="text-white">System Sign In</CardTitle>
            <CardDescription className="text-slate-400">Enter root credentials to manage the platform</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-300">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@system.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-primary"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-300">
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
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 pr-10 focus:ring-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
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
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Login to System'
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800">
                <div className="mb-4 rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-xs text-slate-400">
                  <p>Email: admin@system.com</p>
                  <p>Password: Admin@12345</p>
                </div>
                <p className="text-center text-xs text-slate-500">
                    Secure root access for MK Project Platform
                </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
