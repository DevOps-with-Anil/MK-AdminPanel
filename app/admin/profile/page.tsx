'use client';

import { useAdmin } from '@/contexts/AdminContext';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Pencil,
  Lock,
  X,
  Camera
} from 'lucide-react';

function ProfileContent() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useAdmin();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [avatar, setAvatar] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    role: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: currentUser.name || '',
      email: currentUser.email || '',
      role: currentUser.role.name || '',
      status: currentUser.id ? 'ACTIVE' : prev.status,
    }));
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      // TODO: update profile API

      setSuccess(true);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setAvatar(preview);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/40 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-7 h-7 text-primary" />
              <CardTitle className="text-xl font-medium">
                Profile Information
              </CardTitle>
            </div>

            <div className="flex gap-2">
              {!isEditing && (

                <Button className="gap-2 bg-accent hover:bg-aaccent/70 w-full md:w-auto" onClick={() => setIsEditing(true)}>
                  <Pencil className="w-4 h-4" />
                  Edit Profile
                </Button>
              )}

              <Link href="/admin/change-password">
                <Button className="gap-2 bg-primary hover:bg-primary/90 w-full md:w-auto">
                  <Lock className="w-4 h-4" />
                  Change Password
                </Button>
              </Link>


            </div>
          </div>

          <CardDescription>
            Manage your account information
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Profile Image */}
            <div className="flex justify-center">
              <div className="relative">

                <div className="w-24 h-24 rounded-full overflow-hidden border bg-muted flex items-center justify-center">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>

                {isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary/90"
                    >
                      <Camera className="w-4 h-4" />
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-4 py-3 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5" />
                <p className="text-sm font-medium">
                  Profile updated successfully!
                </p>
              </div>
            )}

            {/* Name */}
            <div className="space-y-2">
              <Label>Full Name</Label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                <Input
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="pl-9 bg-muted/30"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                <Input
                  disabled
                  value={formData.email}
                  className="pl-9 bg-muted/30"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label>Phone Number</Label>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                <Input
                  disabled={!isEditing}
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="pl-9 bg-muted/30"
                />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={formData.role} disabled className="bg-muted/30" />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Input value={formData.status} disabled className="bg-muted/30" />
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return <ProfileContent />;
}
