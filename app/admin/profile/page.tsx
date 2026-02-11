'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import AdminPageTemplate from '@/components/pages/AdminPageTemplate';
import { User } from 'lucide-react';

export default function ProfilePage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <AdminPageTemplate
          title="Profile"
          description="Manage your account profile and personal settings"
          icon={<User className="text-primary" />}
        />
      </AdminLayout>
    </AdminProvider>
  );
}
