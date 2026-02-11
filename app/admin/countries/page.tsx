'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import AdminPageTemplate from '@/components/pages/AdminPageTemplate';
import { Globe } from 'lucide-react';

export default function CountriesPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <AdminPageTemplate
          title="Countries & Regions"
          description="Manage countries, regional settings, and localization configurations"
          icon={<Globe className="text-primary" />}
        />
      </AdminLayout>
    </AdminProvider>
  );
}
