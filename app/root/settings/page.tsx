'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Save, X } from 'lucide-react';

interface SettingsConfig {
  systemName: string;
  supportEmail: string;
  maintenanceMode: boolean;
  maintenanceTenants: string[];
  maintenanceCountries: string[];
  maintenanceMessage: string;
  maintenanceStart: string;
  maintenanceEnd: string;
  emailNotifications: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  maxUploadSize: number;

  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;

  pushApiKey: string;

  allowedFileTypes: string;

}

const tenantOptions = ['tenant-1', 'tenant-2', 'tenant-abc', 'client-x', 'org-99'];
const countryOptions = ['IN', 'US', 'AE', 'UK', 'CA', 'AU'];

function SettingsPageContent() {
  const [settings, setSettings] = useState<SettingsConfig>({
    systemName: 'Islamic Admin Panel',
    supportEmail: 'support@admin.com',
    maintenanceMode: false,
    maintenanceTenants: [],
    maintenanceCountries: [],
    maintenanceMessage: '',
    maintenanceStart: '',
    maintenanceEnd: '',
    emailNotifications: true,
    twoFactorAuth: true,
    sessionTimeout: 30,
    maxUploadSize: 50,

    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',

    pushApiKey: '',
    allowedFileTypes: 'jpg,png,pdf',
  });

  const [tenantQuery, setTenantQuery] = useState('');
  const [countryQuery, setCountryQuery] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const addItem = (field: 'maintenanceTenants' | 'maintenanceCountries', value: string) => {
    if (!value) return;
    setSettings((prev) => {
      if (prev[field].includes(value)) return prev;
      return { ...prev, [field]: [...prev[field], value] };
    });
  };

  const removeItem = (field: 'maintenanceTenants' | 'maintenanceCountries', value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== value),
    }));
  };

  const TagInput = ({ values, query, setQuery, options, onAdd, onRemove, placeholder, disabled }: any) => (
    <div className={`border rounded-md p-2 ${disabled ? 'bg-muted opacity-60' : ''}`}>
      <div className="flex flex-wrap gap-2 items-center">
        {values.map((val: string) => (
          <div key={val} className="flex items-center gap-1 bg-background border px-2 py-1 rounded text-sm">
            {val}
            {!disabled && <X className="w-3 h-3 cursor-pointer" onClick={() => onRemove(val)} />}
          </div>
        ))}

        <input
          disabled={disabled}
          className="flex-1 outline-none bg-transparent text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={disabled ? 'Disabled in global mode' : placeholder}
        />
      </div>

      {!disabled && query && (
        <div className="border rounded mt-2 max-h-32 overflow-auto bg-background">
          {options
            .filter((o: string) => o.toLowerCase().includes(query.toLowerCase()))
            .map((o: string) => (
              <div
                key={o}
                className="p-2 hover:bg-muted cursor-pointer"
                onClick={() => {
                  onAdd(o);
                  setQuery('');
                }}
              >
                {o}
              </div>
            ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start gap-4">
        <Settings className="text-primary w-7 h-7 mt-1" />
        <div>
          <h1 className="text-xl font-medium text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure system settings and preferences</p>
        </div>
      </div>

      {/* General */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-2 block">System Name</Label>
            <Input value={settings.systemName} onChange={(e) => handleInputChange('systemName', e.target.value)} />
          </div>
          <div>
            <Label className="mb-2 block">Support Email</Label>
            <Input type="email" value={settings.supportEmail} onChange={(e) => handleInputChange('supportEmail', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Global Maintenance</Label>
            <Switch checked={settings.maintenanceMode} onCheckedChange={(v) => handleInputChange('maintenanceMode', v)} />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="mb-1">Maintenance Message</Label>
            <Textarea
              placeholder="System under maintenance..."
              value={settings.maintenanceMessage}
              onChange={(e) => handleInputChange('maintenanceMessage', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="mb-1">Start Date & Time</Label>
              <Input
                type="datetime-local"
                value={settings.maintenanceStart}
                onChange={(e) => handleInputChange('maintenanceStart', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="mb-1">End Date & Time</Label>
              <Input
                type="datetime-local"
                value={settings.maintenanceEnd}
                onChange={(e) => handleInputChange('maintenanceEnd', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Tenants</Label>
            <TagInput
              values={settings.maintenanceTenants}
              query={tenantQuery}
              setQuery={setTenantQuery}
              options={tenantOptions}
              onAdd={(v: string) => addItem('maintenanceTenants', v)}
              onRemove={(v: string) => removeItem('maintenanceTenants', v)}
              placeholder="Search & add tenants..."
              disabled={settings.maintenanceMode}
            />
          </div>

          <div>
            <Label className="mb-2 block">Countries</Label>
            <TagInput
              values={settings.maintenanceCountries}
              query={countryQuery}
              setQuery={setCountryQuery}
              options={countryOptions}
              onAdd={(v: string) => addItem('maintenanceCountries', v)}
              onRemove={(v: string) => removeItem('maintenanceCountries', v)}
              placeholder="Search & add countries..."
              disabled={settings.maintenanceMode}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email */}
      <Card>
        <CardHeader>
          <CardTitle>Email Setup (SMTP)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="flex items-center justify-between space-y-2">
            <Label>Email Notifications</Label>
            <Switch checked={settings.emailNotifications} onCheckedChange={(v) => handleInputChange('emailNotifications', v)} />
          </div>
          <div>
            <Label className="mb-2 block">SMTP Host</Label>
            <Input value={settings.smtpHost} onChange={(e) => handleInputChange('smtpHost', e.target.value)} />
          </div>
          <div>
            <Label className="mb-2 block">SMTP Port</Label>
            <Input type="number" value={settings.smtpPort} onChange={(e) => handleInputChange('smtpPort', parseInt(e.target.value))} />
          </div>
          <div>
            <Label className="mb-2 block">SMTP Username</Label>
            <Input value={settings.smtpUser} onChange={(e) => handleInputChange('smtpUser', e.target.value)} />
          </div>
          <div>
            <Label className="mb-2 block">SMTP Password</Label>
            <Input type="password" value={settings.smtpPassword} onChange={(e) => handleInputChange('smtpPassword', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Push */}
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label className="mb-2 block">Push API Key</Label>
            <Input value={settings.pushApiKey} onChange={(e) => handleInputChange('pushApiKey', e.target.value)} />
          </div>
        </CardContent>
      </Card>

         {/* Notifications
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent>
         
        </CardContent>
      </Card> */}

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="mb-2 block">Two-Factor Authentication</Label>
            <Switch checked={settings.twoFactorAuth} onCheckedChange={(v) => handleInputChange('twoFactorAuth', v)} />
          </div>
          <div>
            <Label className="mb-2 block">Session Timeout (minutes)</Label>
            <Input type="number" value={settings.sessionTimeout} onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))} />
          </div>
        </CardContent>
      </Card>

   

      {/* File */}
      {/* <Card>
        <CardHeader>
          <CardTitle>File Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-2 block">Max Upload Size (MB)</Label>
            <Input type="number" value={settings.maxUploadSize} onChange={(e) => handleInputChange('maxUploadSize', parseInt(e.target.value))} />
          </div>
          <Button className="gap-2">
            <Save className="w-4 h-4" /> Save All Changes
          </Button>
        </CardContent>
      </Card> */}
      {/* File */}
<Card>
  <CardHeader className="flex justify-between">
    <CardTitle>File Settings</CardTitle>
    <Button className="gap-2">
      <Save className="w-4 h-4" /> Save
    </Button>
  </CardHeader>

  <CardContent className="space-y-4">
    <div>
      <Label className="mb-2 block">Max Upload Size (MB)</Label>
      <Input
        type="number"
        value={settings.maxUploadSize}
        onChange={(e) =>
          handleInputChange('maxUploadSize', parseInt(e.target.value))
        }
      />
    </div>

    <div>
      <Label className="mb-2 block">Allowed File Types</Label>
      <Input
        placeholder="e.g. jpg, png, pdf"
        value={settings.allowedFileTypes || ''}
        onChange={(e) =>
          handleInputChange('allowedFileTypes', e.target.value)
        }
      />
      <p className="text-xs text-muted-foreground mt-1">
        Enter comma separated values (jpg, png, pdf)
      </p>
    </div>
  </CardContent>
</Card>




      
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AdminProvider>
      <SettingsPageContent />
    </AdminProvider>
  );
}
