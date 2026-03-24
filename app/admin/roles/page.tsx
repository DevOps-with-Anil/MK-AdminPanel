'use client';

import { useAdmin } from '@/contexts/AdminContext';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Shield, Users, Edit2, Trash2, MoreVertical, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MOCK_ROLES } from '@/lib/mock-data';

export default function RolesPage() {
  const { t, currentLanguage } = useAdmin();
  // Simulating fetching roles (converting MOCK_ROLES object to array)
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    // In a real app, fetch from API
    const rolesList = Object.values(MOCK_ROLES).map(role => ({
      ...role,
      // Mocking users count
      usersCount: Math.floor(Math.random() * 10) + 1, 
      description: 'System generated role'
    }));
    setRoles(rolesList);
  }, []);

  // Helper for dynamic fields if they were multilingual objects
  const getName = (role: any) => {
    if (typeof role.name === 'object') {
      return role.name[currentLanguage] || role.name['en'];
    }
    return role.name;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Shield className="text-primary w-7 h-7 mt-1" />
          <div>
            <h1 className="text-xl font-medium">{t('roles.title')}</h1>
            <p className="text-muted-foreground">{t('roles.subtitle')}</p>
          </div>
        </div>
        <Link href="/admin/roles/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> 
            {t('roles.newRole')}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div className="flex flex-col">
             <CardTitle>{t('roles.details')}</CardTitle>
             <CardDescription>{roles.length} role(s) found</CardDescription>
          </div>
           <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('users.searchPlaceholder')}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">{t('roles.roleName')}</th>
                  <th className="text-left py-3 px-4">{t('roles.description')}</th>
                  <th className="text-left py-3 px-4">{t('roles.usersCount')}</th>
                  <th className="text-left py-3 px-4">{t('plans.modulesFeatures')}</th>
                  <th className="text-right py-3 px-4">{t('users.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} className="border-b hover:bg-muted/50">
                    <td className="py-4 px-4 font-medium">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                             <Shield className="w-4 h-4 text-primary" />
                          </div>
                          {getName(role)}
                       </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{role.description}</td>
                    <td className="py-4 px-4">
                       <Badge variant="secondary" className="gap-1">
                          <Users className="w-3 h-3" /> {role.usersCount}
                       </Badge>
                    </td>
                    <td className="py-4 px-4">
                       <span className="font-medium">{role.permissions.length}</span> permissions
                    </td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                          </DropdownMenuTrigger>
                        {/* </DropdownMenuTrigger> */}
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                             <Link href={`/admin/roles/edit/${role.id}`} className="flex items-center gap-2">
                                <Edit2 className="w-4 h-4" /> {t('users.edit')} 
                             </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive flex items-center gap-2">
                            <Trash2 className="w-4 h-4" /> {t('users.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}