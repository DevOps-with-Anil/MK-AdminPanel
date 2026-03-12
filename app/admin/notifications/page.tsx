'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import NotificationPage from '@/components/pages/NotificationPage';

export default function NotificationsRoute() {
  return (
    <AdminProvider>
      <AdminLayout>
        <NotificationPage />
      </AdminLayout>
    </AdminProvider>
  );
}
