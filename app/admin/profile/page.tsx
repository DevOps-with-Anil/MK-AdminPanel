'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { useAdmin } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { userService } from '@/services/user-service';
import { AdminProfileResponse } from '@/lib/types';
import { Loader2, Save, User } from 'lucide-react';

interface ProfileFormState {
  name: string;
  email: string;
}

function getRoleName(role?: AdminProfileResponse['role'], language?: string) {
  if (!role?.name) return 'N/A';
  if (typeof role.name === 'string') return role.name;
  const names = role.name as Record<string, string | undefined>;
  return names[language || 'en'] || names.en || names.fr || names.ar || 'N/A';
}

function formatDate(value?: string | null) {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '-';
  }
}

function ProfilePageContent() {
  const { currentLanguage, refreshUserData } = useAdmin();
  const [profile, setProfile] = useState<AdminProfileResponse | null>(null);
  const [form, setForm] = useState<ProfileFormState>({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const response = await userService.getMyProfile();
    if (!response.success || !response.data) {
      setError(response.message || 'Failed to load profile');
      setProfile(null);
      setIsLoading(false);
      return;
    }

    setProfile(response.data);
    setForm({
      name: response.data.name || '',
      email: response.data.email || '',
    });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const roleLabel = useMemo(
    () => getRoleName(profile?.role, currentLanguage),
    [currentLanguage, profile?.role]
  );

  const syncLocalUserData = (name: string, email: string) => {
    const existingUserData = localStorage.getItem('userData');
    if (!existingUserData) return;

    try {
      const parsed = JSON.parse(existingUserData);
      const updated = {
        ...parsed,
        name,
        email,
      };
      localStorage.setItem('userData', JSON.stringify(updated));
    } catch (storageError) {
      console.error('Failed to sync local userData:', storageError);
    }
  };

  const handleSave = async () => {
    setSuccessMessage(null);
    setError(null);

    if (!form.name.trim()) {
      setError('Name is required.');
      return;
    }

    if (!form.email.trim()) {
      setError('Email is required.');
      return;
    }

    setIsSaving(true);
    const normalizedEmail = form.email.trim().toLowerCase();

    try {
      const response = await userService.updateMyProfile({
        name: form.name.trim(),
        email: normalizedEmail,
      });

      if (!response.success) {
        setError(response.message || 'Failed to update profile');
        return;
      }

      syncLocalUserData(form.name.trim(), normalizedEmail);
      refreshUserData();
      setSuccessMessage('Profile updated successfully.');
      await loadProfile();
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start gap-4">
        <User className="text-primary w-10 h-10 mt-1" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your account information from the profile API.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Editable fields from</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="profile-name" className="mb-2 block">Name</Label>
              <Input
                id="profile-name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <Label htmlFor="profile-email" className="mb-2 block">Email</Label>
              <Input
                id="profile-email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="Enter your email"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}

            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={loadProfile} disabled={isSaving}>
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
            <CardDescription>Read-only fields from</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <Badge variant="outline">{roleLabel}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge>{profile?.status || 'UNKNOWN'}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium">{profile?.phoneNumber || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Allowed Countries</p>
              <p className="font-medium">{profile?.allowedCountries?.join(', ') || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Login</p>
              <p className="font-medium">{formatDate(profile?.lastLoginAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">{formatDate(profile?.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Updated At</p>
              <p className="font-medium">{formatDate(profile?.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security Context</CardTitle>
          <CardDescription>Device and access metadata returned by the profile API</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Last IP</p>
            <p className="font-medium break-all">{profile?.tracking?.lastIp || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Browser</p>
            <p className="font-medium">{profile?.tracking?.lastBrowser || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Device</p>
            <p className="font-medium">{profile?.tracking?.lastDevice || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">OS</p>
            <p className="font-medium">{profile?.tracking?.lastOs || '-'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <ProfilePageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
