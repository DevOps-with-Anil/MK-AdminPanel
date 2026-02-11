'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, MoreVertical, BookOpen } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Article {
  id: string;
  title: string;
  category: string;
  author: string;
  status: 'draft' | 'published';
  views: number;
  createdAt: string;
}

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Introduction to Islamic Finance',
    category: 'Finance',
    author: 'Ahmed Khan',
    status: 'published',
    views: 5420,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Understanding Zakat',
    category: 'Islamic Teachings',
    author: 'Fatima Ali',
    status: 'published',
    views: 8230,
    createdAt: '2024-02-10',
  },
  {
    id: '3',
    title: 'Hadith Collection January 2024',
    category: 'Hadith',
    author: 'Hassan Malik',
    status: 'draft',
    views: 0,
    createdAt: '2024-02-20',
  },
];

function ArticlesPageContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [articles] = useState<Article[]>(mockArticles);

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <BookOpen className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Articles</h1>
            <p className="text-muted-foreground">Manage news articles and blog posts</p>
          </div>
        </div>
        <Link href="/admin/articles/new">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            New Article
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Articles Directory</CardTitle>
          <CardDescription>{filteredArticles.length} article(s) found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Author</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Views</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4 font-medium text-foreground">{article.title}</td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary">{article.category}</Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{article.author}</td>
                    <td className="py-4 px-4">
                      <Badge className={article.status === 'published' ? 'bg-primary' : 'bg-secondary'}>
                        {article.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{article.views.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/articles/edit/${article.id}`} className="gap-2 flex items-center">
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
              <p className="text-3xl font-bold text-primary">{articles.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Articles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">{articles.filter((a) => a.status === 'published').length}</p>
              <p className="text-sm text-muted-foreground mt-1">Published</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{articles.reduce((sum, a) => sum + a.views, 0).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Views</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <ArticlesPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
