'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import AdminPageTemplate from '@/components/pages/AdminPageTemplate';
import { Users } from 'lucide-react';

export default function SubAdminsPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <AdminPageTemplate
          title="Sub Admins"
          description="Create and manage sub-admin accounts under your affiliate account"
          icon={<Users className="text-primary" />}
        />
      </AdminLayout>
    </AdminProvider>
  );
}
