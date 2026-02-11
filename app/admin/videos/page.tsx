'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, MoreVertical, Play } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Video {
  id: string;
  title: string;
  category: string;
  duration: string;
  views: number;
  status: 'draft' | 'published';
  createdAt: string;
}

const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Daily Quran Recitation',
    category: 'Quran',
    duration: '15:30',
    views: 12350,
    status: 'published',
    createdAt: '2024-02-10',
  },
  {
    id: '2',
    title: 'Islamic History - Part 1',
    category: 'History',
    duration: '45:20',
    views: 8920,
    status: 'published',
    createdAt: '2024-02-12',
  },
  {
    id: '3',
    title: 'Understanding Sunnah',
    category: 'Education',
    duration: '32:15',
    views: 0,
    status: 'draft',
    createdAt: '2024-02-20',
  },
];

function VideosPageContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos] = useState<Video[]>(mockVideos);

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Play className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Videos</h1>
            <p className="text-muted-foreground">Manage video content and recordings</p>
          </div>
        </div>
        <Link href="/admin/videos/new">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            New Video
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Videos Directory</CardTitle>
          <CardDescription>{filteredVideos.length} video(s) found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Duration</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Views</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVideos.map((video) => (
                  <tr key={video.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4 font-medium text-foreground">{video.title}</td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary">{video.category}</Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{video.duration}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{video.views.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <Badge className={video.status === 'published' ? 'bg-primary' : 'bg-secondary'}>
                        {video.status}
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
                            <Link href={`/admin/videos/edit/${video.id}`} className="gap-2 flex items-center">
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
              <p className="text-3xl font-bold text-primary">{videos.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Videos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">{videos.filter((v) => v.status === 'published').length}</p>
              <p className="text-sm text-muted-foreground mt-1">Published</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{videos.reduce((sum, v) => sum + v.views, 0).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Views</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VideosPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <VideosPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
