'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import Dashboard from '@/components/pages/Dashboard';

export default function HomePage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <Dashboard />
      </AdminLayout>
    </AdminProvider>
  );
}
