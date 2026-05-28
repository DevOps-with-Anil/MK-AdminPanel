
'use client';

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  AlertCircle, Eye, EyeOff, Loader2, CheckCircle, Globe
} from 'lucide-react';
import { LANGUAGES, Language } from '@/i18n/languages';
import { useAdmin } from '@/contexts/AdminContext';
import Image from 'next/image';
import { login, profile } from '@/services/auth.service';
import { useTranslation } from '@/hooks/useTranslation';
import { I18nContext } from '@/i18n/provider';

export default function RootLoginPage() {
  const { t } = useTranslation();
  const { locale, changeLanguage } = useContext(I18nContext);

  const router = useRouter();
  const { setAdminType, setCurrentUser } = useAdmin();

  const [email, setEmail] = useState('root@mkproject.com');
  const [password, setPassword] = useState('Root@12345');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
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
    setSuccessMsg('');

    try {
      const res = await login({ email, password });
      const { user } = res.data;
      setCurrentUser(user);
      // // console.log("Login Response ::", res);
      setSuccessMsg(t('translate.success'));

      setTimeout(() => {
        router.replace("/root/dashboard");
      }, 1500);
    } catch (err: any) {
      setError(err?.message || t('translate.error'));
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-4">

      {/* 🌐 Language Dropdown */}


      <div className="absolute top-4 right-4" ref={dropdownRef}>
        <button
          onClick={() => setOpenLang(!openLang)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
        >
          <span className="flex items-center gap-1 text-sm">
            <span className="text-sm leading-none">
              {LANGUAGES[locale as Language]?.flag}
            </span>
            <span className="leading-none">
              {LANGUAGES[locale as Language]?.label}
            </span>
          </span>
        </button>

        {openLang && (
          <div className="absolute right-0 mt-2 w-40 bg-slate-900 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
            {Object.entries(LANGUAGES).map(([code, data]) => (
              <button
                key={code}
                onClick={() => {
                  changeLanguage(code as Language);
                  setOpenLang(false);
                }}
                className={`w-full px-3 py-2 text-sm flex items-center gap-2 transition ${locale === code
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
                  }`}
              >
                <span className="text-base leading-none">{data.flag}</span>
                <span className="leading-none">{data.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <Image
              src="/apple-icon.png"
              alt="Logo"
              width={60}
              height={60}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {t('translate.singinHeading')}
          </h1>
        </div>

        <Card className="border-slate-800 bg-slate-900 shadow-2xl">
          <CardHeader className="space-y-1 border-b border-slate-800">
            <CardTitle className="text-white">
              {t('translate.signinTitle')}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {t('translate.singinSubtitle')}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">

              {error && (
                <div className="bg-red-50 border border-red-500 rounded-lg p-3 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {successMsg && (
                <div className="bg-green-50 border border-green-900 rounded-lg p-3 flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-700">{successMsg}</p>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm text-slate-300">
                  {t('translate.emailLabel')}
                </label>
                <Input
                  type="email"
                  placeholder={t('translate.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm text-slate-300">
                  {t('translate.passwordLabel')}
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="bg-slate-800 border-slate-700 text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full bg-primary hover:bg-primary/90 h-11"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('translate.authenticating')}
                  </>
                ) : (
                  t('translate.loginBtn')
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800">
              <p className="text-center text-xs text-slate-500">
                &copy; {new Date().getFullYear()} MK Projects. {t('translate.footer')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
