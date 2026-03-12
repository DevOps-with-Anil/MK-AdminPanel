'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Mail, Phone, Save, User } from 'lucide-react';
import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdmin } from '@/contexts/AdminContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { updateRootAdminProfile } from '@/lib/client-auth';

function ProfileContent() {
  const {
    currentCountry,
    currentLanguage,
    currentUser,
    isProfileLoading,
    profileError,
    refreshProfile,
    rootProfile,
  } = useAdmin();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneCode: '+91',
    phoneNumber: '',
    photo: '',
  });

  const countryNames: Record<string, string> = {
    IN: 'India',
    AE: 'United Arab Emirates',
    US: 'United States',
  };
  const defaultPhoneCodes: Record<string, string> = {
    IN: '+91',
    AE: '+971',
    US: '+1',
  };

  useEffect(() => {
    setFormData({
      name: rootProfile?.name || currentUser.name || '',
      email: rootProfile?.email || currentUser.email || '',
      phoneCode: defaultPhoneCodes[currentCountry] || '+91',
      phoneNumber: rootProfile?.phoneNumber || '',
      photo: rootProfile?.photo || '',
    });
  }, [currentCountry, currentUser.email, currentUser.name, rootProfile]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess('');

    if (!formData.name.trim()) {
      setSaveError('Name is required');
      return;
    }

    if (!formData.email.trim()) {
      setSaveError('Email is required');
      return;
    }

    setIsSaving(true);

    try {
      const apiLanguage = currentLanguage === 'ar' ? 'ar' : 'en';

      await updateRootAdminProfile(
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phoneCode: formData.phoneCode.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          photo: formData.photo.trim(),
        },
        apiLanguage
      );

      await refreshProfile();
      setSaveSuccess('Profile updated successfully.');
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex items-center gap-4 mb-2">
          <div className="text-primary">
            <User className="text-primary" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Current logged in admin details</p>
          </div>
        </div>
      </div>

      {profileError && (
        <Card className="border-destructive/30">
          <CardContent className="p-4 text-sm text-destructive">
            {profileError}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {saveError && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{saveError}</p>
              </div>
            )}

            {saveSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-4 py-3 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{saveSuccess}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2">
                <Label htmlFor="name" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <User size={16} />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  disabled={isProfileLoading || isSaving}
                  className="bg-background"
                />
              </div>

              <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2">
                <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Mail size={16} />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={isProfileLoading || isSaving}
                  className="bg-background"
                />
              </div>

              <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2">
                <Label htmlFor="phoneCode" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Phone size={16} />
                  Phone Code
                </Label>
                <Input
                  id="phoneCode"
                  value={formData.phoneCode}
                  onChange={(e) => handleChange('phoneCode', e.target.value)}
                  disabled={isProfileLoading || isSaving}
                  className="bg-background"
                />
              </div>

              <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2">
                <Label htmlFor="phoneNumber" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Phone size={16} />
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  disabled={isProfileLoading || isSaving}
                  className="bg-background"
                />
              </div>

              <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2 md:col-span-2">
                <Label htmlFor="photo" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <User size={16} />
                  Photo URL
                </Label>
                <Input
                  id="photo"
                  value={formData.photo}
                  onChange={(e) => handleChange('photo', e.target.value)}
                  disabled={isProfileLoading || isSaving}
                  className="bg-background"
                  placeholder="https://cdn.example.com/avatar.png"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isProfileLoading || isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-muted-foreground">Last Login</span>
            <span className="font-medium text-foreground">
              {isProfileLoading ? 'Loading...' : currentUser.lastLogin}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-muted-foreground">Allowed Countries</span>
            <span className="font-medium text-foreground">
              {isProfileLoading
                ? 'Loading...'
                : rootProfile?.allowedCountries.length
                  ? rootProfile.allowedCountries.join(', ')
                  : 'Global access'}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-muted-foreground">Role</span>
            <span className="font-medium text-foreground">
              {isProfileLoading ? 'Loading...' : rootProfile?.role.name || currentUser.role.name}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-muted-foreground">Country</span>
            <span className="font-medium text-foreground">
              {countryNames[currentCountry] || currentCountry}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium text-foreground">
              {isProfileLoading ? 'Loading...' : rootProfile?.status || 'ACTIVE'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Account ID</span>
            <span className="font-medium text-foreground">
              {isProfileLoading ? 'Loading...' : rootProfile?.id || currentUser.id}
            </span>
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
        <ProfileContent />
      </AdminLayout>
    </AdminProvider>
  );
}
