'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, MoreVertical, Tags } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Quran',
    description: 'Quranic verses and recitations',
    itemCount: 45,
    status: 'active',
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'Hadith',
    description: 'Collections of Hadith',
    itemCount: 32,
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    name: 'Islamic History',
    description: 'Historical content about Islam',
    itemCount: 28,
    status: 'active',
    createdAt: '2024-01-20',
  },
  {
    id: '4',
    name: 'Finance',
    description: 'Islamic finance and banking',
    itemCount: 18,
    status: 'active',
    createdAt: '2024-02-01',
  },
];

function CategoriesPageContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories] = useState<Category[]>(mockCategories);

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Tags className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Categories</h1>
            <p className="text-muted-foreground">Organize content into categories</p>
          </div>
        </div>
        <Link href="/admin/categories/new">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            New Category
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories Directory</CardTitle>
          <CardDescription>{filteredCategories.length} category/ies found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Description</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Items</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4 font-medium text-foreground">{category.name}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{category.description}</td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary">{category.itemCount}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={category.status === 'active' ? 'bg-primary' : 'bg-muted'}>
                        {category.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/categories/edit/${category.id}`} className="gap-2 flex items-center">
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <Trash2 className="w-4 h-4" />
                            Delete
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{categories.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Categories</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">{categories.reduce((sum, c) => sum + c.itemCount, 0)}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Items</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{categories.filter((c) => c.status === 'active').length}</p>
              <p className="text-sm text-muted-foreground mt-1">Active</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <CategoriesPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
