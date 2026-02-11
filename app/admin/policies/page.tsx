'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import AdminPageTemplate from '@/components/pages/AdminPageTemplate';
import { BookOpen } from 'lucide-react';

export default function PoliciesPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <AdminPageTemplate
          title="Policies & FAQ"
          description="Manage system policies, terms of service, and frequently asked questions"
          icon={<BookOpen className="text-primary" />}
        />
      </AdminLayout>
    </AdminProvider>
  );
}
