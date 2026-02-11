'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import AdminPageTemplate from '@/components/pages/AdminPageTemplate';
import { CheckCircle } from 'lucide-react';

export default function VerificationPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <AdminPageTemplate
          title="Verification Status"
          description="Track your account verification status and submit verification documents"
          icon={<CheckCircle className="text-primary" />}
        />
      </AdminLayout>
    </AdminProvider>
  );
}
