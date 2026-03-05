'use client';

import { useEffect } from 'react';
import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { AuthGuard } from '@/components/AuthGuard';
import { useAdmin } from '@/contexts/AdminContext';
import { useRouter } from 'next/navigation';
import { MODULES } from '@/lib/mock-data';

function HomeRedirect() {
  const router = useRouter();
  const { canAccessModule, isLoading } = useAdmin();

  useEffect(() => {
    if (isLoading) return;

    const routeCandidates = [
      { module: MODULES.ADMIN_USERS, href: '/admin/users' },
      { module: MODULES.ROLES_PERMISSIONS, href: '/admin/roles' },
      { module: MODULES.MODULES_ACTIONS, href: '/admin/modules' },
      { module: 'audit_logs', href: '/admin/audit-logs' },
      { module: MODULES.SUBSCRIPTION_PLANS, href: '/admin/plans' },
      { module: MODULES.AFFILIATES, href: '/admin/affiliates' },
      { module: MODULES.COUNTRIES, href: '/admin/countries' },
      { module: MODULES.CMS, href: '/admin/cms' },
      { module: MODULES.CHALLENGES, href: '/admin/challenges' },
      { module: MODULES.ADS, href: '/admin/ads' },
      { module: MODULES.SUPPORT_TICKETS, href: '/admin/tickets' },
      { module: MODULES.POLICIES_FAQ, href: '/admin/policies' },
      { module: MODULES.PROFILE, href: '/admin/profile' },
      { module: MODULES.VERIFICATION, href: '/admin/verification' },
    ];

    const firstAccessible = routeCandidates.find((route) => canAccessModule(route.module));

    if (firstAccessible) {
      router.replace(firstAccessible.href);
    }
  }, [canAccessModule, isLoading, router]);

  return (
    <div className="p-6 text-sm text-muted-foreground">
      Loading your permitted admin pages...
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthGuard>
      <AdminProvider>
        <AdminLayout>
          <HomeRedirect />
        </AdminLayout>
      </AdminProvider>
    </AuthGuard>
  );
}
