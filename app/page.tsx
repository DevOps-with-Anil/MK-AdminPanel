'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import Dashboard from '@/components/pages/Dashboard';
import { AuthGuard } from '@/components/AuthGuard';

export default function HomePage() {
  return (
    <AuthGuard>
      <AdminProvider>
        <AdminLayout>
          <Dashboard />
        </AdminLayout>
      </AdminProvider>
    </AuthGuard>
  );
}
