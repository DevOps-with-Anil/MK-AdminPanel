'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, AlertCircle, CheckCircle2, Loader2, EyeOff, Eye } from 'lucide-react';
import { changePassword } from '@/services/auth.service';

function ChangePasswordContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });


function validatePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}) {
    if (!data.currentPassword) {
        return "Current password is required";
    }

    if (!data.newPassword) {
        return "New password is required";
    }

    if (data.newPassword.length < 8) {
        return "Password must be at least 8 characters long..";
    }

    if (data.newPassword !== data.confirmPassword) {
        return "New passwords do not match";
    }

    return null; // valid
}


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    setSuccess(false);

    // Centralized validation
    const validationError = validatePassword(formData);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const res = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      console.log("Chnage Password Response on Page ::  " + JSON.stringify(res));

      // Success
      setSuccess(true);
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => {
      setSuccess(false);  
      }, 2000);

    } catch (err: any) {
      setError(err?.message);
      setTimeout(() => {
      setError("");  
      }, 2000);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/40 bg-muted/20">
          <div className="flex items-center gap-2">
            <Lock className="w-7 h-7 text-primary" />
            <CardTitle className="text-xl font-medium">Change Password</CardTitle>
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
              <div className="relative">

                <Input
                  id="currentPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="bg-muted/30"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  {/* New Password */}
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="bg-muted/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    disabled={isLoading}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">

                  {/* Confirm Password */}
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="bg-muted/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full md:w-auto min-w-[150px] shadow-sm shadow-primary/20"
                disabled={isLoading || !formData.newPassword || !formData.confirmPassword || !formData.currentPassword}
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

      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <h3 className="text-lg font-medium text-blue-700 mb-1 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Password Requirements
        </h3>
        <ul className="text-sm text-blue-600/80 space-y-1 list-disc pl-4">
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
      <ChangePasswordContent />
    </AdminProvider>
  );
}
