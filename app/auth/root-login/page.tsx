'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import Image from 'next/image';
import { login } from '@/services/auth.service';
import { AdminType } from '@/types/admin.types';
import { tokenStorage } from '@/utils/token';

export default function RootLoginPage() {
  const router = useRouter();
  const { setAdminType, setCurrentUser } = useAdmin();

  const [email, setEmail] = useState('root@mkproject.com');
  const [password, setPassword] = useState('Root@12345');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // -----------------------------
  // Check if user is already logged in (client-side)
  // -----------------------------
  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('mk_token='))
      ?.split('=')[1];

    if (token) {
      // Already logged in, redirect to dashboard
      router.replace('/admin/dashboard');
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await login({ email, password });
      const { token, user } = res.data;

      // Save token in cookie/localStorage
      tokenStorage.set(token);

      // Determine admin type
      const adminType: AdminType =
        user.role.name.toLowerCase().includes('root') ? 'root-admin' : 'tenant-admin';

      setAdminType(adminType);
      setCurrentUser(user);

      // Show success message briefly
      setSuccessMsg('Login successful! Redirecting to dashboard...');
      setTimeout(() => router.push('/admin/dashboard'), 2500);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingAuth) {
    // Prevent page flicker while checking session
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin w-8 h-8 text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <Image src="/apple-icon.png" alt="Logo" width={60} height={60} className="object-contain" priority />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MK Administration</h1>
        </div>

        <Card className="border-slate-800 bg-slate-900 shadow-2xl">
          <CardHeader className="space-y-1 border-b border-slate-800">
            <CardTitle className="text-white">System Sign In</CardTitle>
            <CardDescription className="text-slate-400">
              Enter root credentials to manage the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Error Message */}
              {error && (
                // <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex items-start gap-3">
                  <div className="bg-red-50 border border-red-500 rounded-lg p-3 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {successMsg && (
                <div className="bg-green-50 border border-green-900 rounded-lg p-3 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">{successMsg}</p>
                </div>
              )}

              {/* Email */}
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
                  required
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-primary"
                />
              </div>

              {/* Password */}
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
                    required
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 pr-10 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Authenticating...
                  </>
                ) : (
                  'Login to System'
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800">
              <p className="text-center text-xs text-slate-500">
                &copy; {new Date().getFullYear()} MK Projects. All rights reserved.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}