'use client';

import React from "react"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Eye, EyeOff, Loader2, Store } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';

export default function AffiliateLoginPage() {
  const router = useRouter();
  const { setAdminType } = useAdmin();
  const [email, setEmail] = useState('hassan@affiliate.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // For demo purposes, we'll just set the admin type and redirect
      setAdminType('affiliate-admin');
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">Affiliate Panel</h1>
          <p className="text-indigo-600">Business Management Portal</p>
        </div>

        {/* Login Card */}
        <Card className="border-indigo-100 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 border-b border-indigo-50">
            <CardTitle className="text-indigo-950">Affiliate Sign In</CardTitle>
            <CardDescription className="text-indigo-600/70">Enter business credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-indigo-900">
                  Business Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hassan@affiliate.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-indigo-50/50 border-indigo-100 text-indigo-900 placeholder:text-indigo-300 focus:ring-indigo-600"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-indigo-900">
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
                    className="bg-indigo-50/50 border-indigo-100 text-indigo-900 placeholder:text-indigo-300 pr-10 focus:ring-indigo-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-600 transition-colors"
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
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Login to Dashboard'
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-indigo-50">
                <p className="text-center text-xs text-indigo-400">
                    Enterprise business portal powered by MK Project
                </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
