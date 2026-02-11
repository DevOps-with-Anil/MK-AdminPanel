'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, MoreVertical, FileText } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Content {
  id: string;
  title: string;
  type: 'article' | 'video' | 'image';
  author: string;
  status: 'draft' | 'published';
  views: number;
  createdAt: string;
}

const mockContent: Content[] = [
  {
    id: '1',
    title: 'Introduction to Islamic Finance',
    type: 'article',
    author: 'Ahmed Khan',
    status: 'published',
    views: 5420,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Daily Quran Recitation',
    type: 'video',
    author: 'Fatima Ali',
    status: 'published',
    views: 12350,
    createdAt: '2024-02-10',
  },
  {
    id: '3',
    title: 'Hadith Collection January 2024',
    type: 'article',
    author: 'Hassan Malik',
    status: 'draft',
    views: 0,
    createdAt: '2024-02-20',
  },
  {
    id: '4',
    title: 'Islamic Art Gallery',
    type: 'image',
    author: 'Aisha Ahmed',
    status: 'published',
    views: 8920,
    createdAt: '2024-03-05',
  },
];

function CMSPageContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [content] = useState<Content[]>(mockContent);

  const filteredContent = content.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      article: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      video: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      image: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <FileText className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Content Management</h1>
            <p className="text-muted-foreground">Create and manage articles, videos, and content</p>
          </div>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          New Content
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Items</CardTitle>
          <CardDescription>{filteredContent.length} item(s) found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Author</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Views</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContent.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4 font-medium text-foreground">{item.title}</td>
                    <td className="py-4 px-4">
                      <Badge className={getTypeBadge(item.type)}>{item.type}</Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{item.author}</td>
                    <td className="py-4 px-4">
                      <Badge className={item.status === 'published' ? 'bg-primary' : 'bg-secondary'}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{item.views.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right">
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
              <p className="text-3xl font-bold text-primary">{content.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Content</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">{content.filter((c) => c.status === 'published').length}</p>
              <p className="text-sm text-muted-foreground mt-1">Published</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{content.reduce((sum, c) => sum + c.views, 0).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Views</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CMSPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <CMSPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
