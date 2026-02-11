'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import AdminPageTemplate from '@/components/pages/AdminPageTemplate';
import { Lock } from 'lucide-react';

export default function PermissionsPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <AdminPageTemplate
          title="Permission Packages"
          description="Define permission packages for different subscription tiers and admin roles"
          icon={<Lock className="text-primary" />}
        />
      </AdminLayout>
    </AdminProvider>
  );
}
