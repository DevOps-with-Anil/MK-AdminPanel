'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, Globe, Search } from 'lucide-react';

export default function CountriesPage() {
  return (
    <AdminProvider>
       <AdminLayout>
        <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Globe className="text-primary w-7 h-7 mt-1" />
          <div>
            <h1 className="text-xl font-medium text-foreground">Countries & Regions</h1>
            <p className="text-muted-foreground">Manage countries, regions, and localization settings</p> 
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by country or region..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Countries & Regions</CardTitle>
          <CardDescription>Manage countries, regions, and localization settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Table with countries and regions will be here.</p>   
        </CardContent>
      </Card>
      </div>
      </AdminLayout>
    </AdminProvider>
  );
}
