'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, Search } from 'lucide-react';

export default function VerificationPage() {
  return (
    <AdminProvider>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">

          <div className="flex items-start gap-4">
            <CheckCircle className="text-primary w-7 h-7 mt-1" />
            <div>
              <h1 className="text-xl font-medium text-foreground">KYB Requests</h1>
              <p className="text-muted-foreground">Manage and review KYB submissions</p>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search requests..."
                className="pl-10"
              />
            </div>
          </div>

        </div>

        <Card>
          <CardHeader>
            <CardTitle>KYB Requests</CardTitle>
            <CardDescription>Review and process new KYB submissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Table with KYB requests will be here.</p>
          </CardContent>
        </Card>
      </div>
    </AdminProvider >
  );
}
