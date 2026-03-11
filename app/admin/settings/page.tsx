'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { useAdmin } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Save } from 'lucide-react';
import { userService } from '@/services/user-service';

interface SettingsConfig {
  systemName: string;
  supportEmail: string;
  maintenanceMode: boolean;
  emailNotifications: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  maxUploadSize: number;
}

function SettingsPageContent() {
  const { currentUser, refreshUserData } = useAdmin();
  const [settings, setSettings] = useState<SettingsConfig>({
    systemName: 'Islamic Admin Panel',
    supportEmail: 'support@admin.com',
    maintenanceMode: false,
    emailNotifications: true,
    twoFactorAuth: true,
    sessionTimeout: 30,
    maxUploadSize: 50,
  });
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);

  useEffect(() => {
    if (currentUser?.name || currentUser?.email) {
      setSettings((prev) => ({
        ...prev,
        systemName: currentUser.name || prev.systemName,
        supportEmail: currentUser.email || prev.supportEmail,
      }));
    }
  }, [currentUser?.name, currentUser?.email]);

  const handleInputChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveGeneralSettings = async () => {
    if (!settings.systemName.trim()) {
      alert('System Name is required');
      return;
    }
    if (!settings.supportEmail.trim()) {
      alert('Email is required');
      return;
    }

    try {
      setIsSavingGeneral(true);
      const response = await userService.updateMyProfile({
        name: settings.systemName.trim(),
        email: settings.supportEmail.trim().toLowerCase(),
      });

      if (!response.success) {
        alert(response.message || 'Failed to update settings');
        return;
      }

      const existingUserData = localStorage.getItem('userData');
      if (existingUserData) {
        try {
          const parsed = JSON.parse(existingUserData);
          const updated = {
            ...parsed,
            name: settings.systemName.trim(),
            email: settings.supportEmail.trim().toLowerCase(),
          };
          localStorage.setItem('userData', JSON.stringify(updated));
        } catch (storageErr) {
          console.error('Failed to sync local userData:', storageErr);
        }
      }

      refreshUserData();
      alert('Settings updated successfully');
    } catch (err) {
      console.error('Error updating settings:', err);
      alert('An error occurred while updating settings');
    } finally {
      setIsSavingGeneral(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start gap-4">
        <Settings className="text-primary w-10 h-10 mt-1" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure system settings and preferences</p>
        </div>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Basic system configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="systemName" className="mb-2 block">
              System Name
            </Label>
            <Input
              id="systemName"
              value={settings.systemName}
              onChange={(e) => handleInputChange('systemName', e.target.value)}
              placeholder="Enter system name"
            />
          </div>
          <div>
            <Label htmlFor="supportEmail" className="mb-2 block">
              Support Email
            </Label>
            <Input
              id="supportEmail"
              type="email"
              value={settings.supportEmail}
              onChange={(e) => handleInputChange('supportEmail', e.target.value)}
              placeholder="support@example.com"
            />
          </div>
          <Button
            className="gap-2 bg-primary hover:bg-primary/90"
            onClick={handleSaveGeneralSettings}
            disabled={isSavingGeneral}
          >
            <Save className="w-4 h-4" />
            {isSavingGeneral ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Configure security and authentication options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
            <Switch
              id="twoFactorAuth"
              checked={settings.twoFactorAuth}
              onCheckedChange={(value) => handleInputChange('twoFactorAuth', value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
            <Switch
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onCheckedChange={(value) => handleInputChange('maintenanceMode', value)}
            />
          </div>
          <div>
            <Label htmlFor="sessionTimeout" className="mb-2 block">
              Session Timeout (minutes)
            </Label>
            <Input
              id="sessionTimeout"
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
              placeholder="30"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="emailNotifications">Email Notifications</Label>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={(value) => handleInputChange('emailNotifications', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* File Settings */}
      <Card>
        <CardHeader>
          <CardTitle>File & Upload Settings</CardTitle>
          <CardDescription>Configure file upload parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="maxUploadSize" className="mb-2 block">
              Max Upload Size (MB)
            </Label>
            <Input
              id="maxUploadSize"
              type="number"
              value={settings.maxUploadSize}
              onChange={(e) => handleInputChange('maxUploadSize', parseInt(e.target.value))}
              placeholder="50"
            />
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4" />
            Save All Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <SettingsPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
