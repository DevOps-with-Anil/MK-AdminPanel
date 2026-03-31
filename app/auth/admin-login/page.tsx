'use client';

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Eye, EyeOff, Loader2, Store, Globe } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { adminLogin } from '@/services/auth.service';
import { tokenStorage } from '@/utils/token';
import { useTranslation } from '@/hooks/useTranslation';
import { I18nContext } from '@/i18n/provider';
import { LANGUAGES } from '@/lib/mock-data';

export default function AffiliateLoginPage() {
  const router = useRouter();
  const { setCurrentUser } = useAdmin();
  const { t } = useTranslation();
  const { locale, changeLanguage } = useContext(I18nContext);

  const [email, setEmail] = useState('root@mkproject.com');
  const [password, setPassword] = useState('Root@12345');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Language dropdown state
  const [openLang, setOpenLang] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenLang(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await adminLogin({ email, password });
      const { token, user } = res.data;

      tokenStorage.set(token);
      setCurrentUser(user);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err?.message || t('adminLogin.error')); // Use translation key for error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-indigo-50 flex items-center justify-center p-4">
      
      {/* 🌐 Language Dropdown */}
      <div className="absolute top-4 right-4" ref={dropdownRef}>
        <button
          onClick={() => setOpenLang(!openLang)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-indigo-100 text-indigo-900 hover:bg-indigo-50 transition shadow-sm"
        >
          <Globe className="w-4 h-4 text-indigo-600" />
          <span className="text-xs uppercase font-medium">
            {LANGUAGES[locale as 'en' | 'fr'].flag} {locale.toUpperCase()}
          </span>
        </button>

        {openLang && (
          <div className="absolute right-0 mt-2 w-36 bg-white border border-indigo-100 rounded-lg shadow-lg overflow-hidden z-50">
            {Object.entries(LANGUAGES)
              .filter(([code]) => code === 'en' || code === 'fr')
              .map(([code, data]) => (
                <button
                  key={code}
                  onClick={() => {
                    changeLanguage(code as 'en' | 'fr');
                    setOpenLang(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition flex items-center gap-2 ${
                    locale === code
                      ? 'bg-indigo-50 text-indigo-900 font-medium'
                      : 'text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <span>{data.flag}</span>
                  <span>{data.label}</span>
                </button>
              ))}
          </div>
        )}
      </div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">{t('adminLogin.panelTitle')}</h1>
        </div>

        {/* Login Card */}
        <Card className="border-indigo-100 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 border-b border-indigo-200">
            <CardTitle className="text-indigo-950">{t('adminLogin.signInTitle')}</CardTitle>
            <CardDescription className="text-indigo-600/70">{t('adminLogin.signInDescription')}</CardDescription>
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
                  {t('adminLogin.emailLabel')}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('adminLogin.emailPlaceholder')}
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
                  {t('adminLogin.passwordLabel')}
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
                    {t('adminLogin.signingIn')}
                  </>
                ) : (
                  t('adminLogin.loginButton')
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-indigo-50">
              <p className="text-center text-xs text-indigo-400">
                {t('adminLogin.poweredBy')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
