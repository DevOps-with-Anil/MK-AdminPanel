'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, ShieldCheck, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

function ChangePasswordContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <KeyRound className="text-primary w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Security</h1>
          <p className="text-muted-foreground">Manage your account security and password</p>
        </div>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/40 bg-muted/20">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl">Change Password</CardTitle>
          </div>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">Password updated successfully!</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                required
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="bg-muted/30"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="bg-muted/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="bg-muted/30"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full md:w-auto min-w-[150px] shadow-sm shadow-primary/20" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
        <h3 className="text-sm font-bold text-blue-700 mb-1 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Password Requirements
        </h3>
        <ul className="text-xs text-blue-600/80 space-y-1 list-disc pl-4">
          <li>Minimum 8 characters long</li>
          <li>At least one uppercase letter</li>
          <li>At least one number or special character</li>
          <li>Cannot be the same as your previous password</li>
        </ul>
      </div>
    </div>
  );
}

export default function ChangePasswordPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <ChangePasswordContent />
      </AdminLayout>
    </AdminProvider>
  );
}
