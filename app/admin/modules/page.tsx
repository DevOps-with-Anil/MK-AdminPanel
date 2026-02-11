'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, MoreVertical, Layers, CheckCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Module {
  id: string;
  name: string;
  description: string;
  features: number;
  plans: string[];
  status: 'active' | 'inactive';
}

const mockModules: Module[] = [
  {
    id: 'MOD001',
    name: 'Dashboard',
    description: 'Main dashboard and analytics',
    features: 5,
    plans: ['free', 'pro', 'enterprise'],
    status: 'active',
  },
  {
    id: 'MOD002',
    name: 'Content Management',
    description: 'Create and manage articles, videos, and media',
    features: 12,
    plans: ['pro', 'enterprise'],
    status: 'active',
  },
  {
    id: 'MOD003',
    name: 'User Management',
    description: 'Admin users and role management',
    features: 8,
    plans: ['enterprise'],
    status: 'active',
  },
  {
    id: 'MOD004',
    name: 'Analytics',
    description: 'Advanced analytics and reporting',
    features: 15,
    plans: ['enterprise'],
    status: 'active',
  },
  {
    id: 'MOD005',
    name: 'API Access',
    description: 'REST API and webhooks',
    features: 10,
    plans: ['enterprise'],
    status: 'inactive',
  },
];

function ModulesPageContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [modules] = useState<Module[]>(mockModules);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const filteredModules = modules.filter(
    (mod) =>
      mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPlanBadgeColor = (plan: string) => {
    const colors: Record<string, string> = {
      free: 'bg-blue-100 text-blue-800',
      pro: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-amber-100 text-amber-800',
    };
    return colors[plan] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Layers className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Modules & Features</h1>
            <p className="text-muted-foreground">Manage platform modules and assign features to plans</p>
          </div>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          New Module
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Modules List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Modules</CardTitle>
              <CardDescription>{filteredModules.length} module(s) found</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredModules.map((mod) => (
                  <div
                    key={mod.id}
                    onClick={() => setSelectedModule(mod.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedModule === mod.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{mod.name}</h3>
                        <p className="text-sm text-muted-foreground">{mod.description}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{mod.features} features</Badge>
                        <Badge className={mod.status === 'active' ? 'bg-primary' : 'bg-muted'}>
                          {mod.status}
                        </Badge>
                      </div>
                      {selectedModule === mod.id && <CheckCircle className="w-5 h-5 text-primary" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plan Assignment */}
        <div>
          <Card className="sticky top-0">
            <CardHeader>
              <CardTitle>Plan Assignment</CardTitle>
              <CardDescription>Assign to subscription plans</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedModule ? (
                <>
                  {modules.map((mod) => {
                    if (mod.id !== selectedModule) return null;
                    return (
                      <div key={mod.id} className="space-y-3">
                        <div className="flex flex-col gap-2">
                          {['free', 'pro', 'enterprise'].map((plan) => (
                            <label key={plan} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={mod.plans.includes(plan)}
                                readOnly
                                className="w-4 h-4 rounded border-border"
                              />
                              <span className="flex-1 text-sm font-medium capitalize">{plan}</span>
                              <Badge className={getPlanBadgeColor(plan)}>{plan}</Badge>
                            </label>
                          ))}
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary/90">Save Assignment</Button>
                      </div>
                    );
                  })}
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Select a module to view plan assignment</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{modules.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Modules</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">{modules.reduce((sum, m) => sum + m.features, 0)}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Features</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{modules.filter((m) => m.status === 'active').length}</p>
              <p className="text-sm text-muted-foreground mt-1">Active Modules</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ModulesPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <ModulesPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
