'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Megaphone, Search } from 'lucide-react';

export default function AdsPage() {
  return (
    <AdminProvider>



      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
            <Megaphone className="text-primary w-7 h-7 mt-1" />
            <div>
              <h1 className="text-xl font-medium text-foreground">Advertisements</h1>
              <p className="text-muted-foreground">Manage and review advertisement campaigns, banners, and promotional content</p>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by advertisement ID..."
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Ad Campaigns</CardTitle>
            <CardDescription>Review and process new ad campaigns.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Table with pending ad campaigns will be here.</p>
          </CardContent>
        </Card>
      </div>


    </AdminProvider>
  );
}
