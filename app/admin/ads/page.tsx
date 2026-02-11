'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import AdminPageTemplate from '@/components/pages/AdminPageTemplate';
import { Megaphone } from 'lucide-react';

export default function AdsPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <AdminPageTemplate
          title="Ads"
          description="Manage advertising campaigns, banners, and promotional content"
          icon={<Megaphone className="text-primary" />}
        />
      </AdminLayout>
    </AdminProvider>
  );
}
