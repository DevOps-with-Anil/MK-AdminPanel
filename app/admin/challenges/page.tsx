'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, MoreVertical, Trophy } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  participants: number;
  completions: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Read Quran Daily',
    description: '30-day challenge to read Quran daily',
    difficulty: 'easy',
    participants: 2340,
    completions: 1850,
    status: 'active',
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    title: 'Islamic History Quest',
    description: 'Learn Islamic history through 10 chapters',
    difficulty: 'medium',
    participants: 1200,
    completions: 450,
    status: 'active',
    createdAt: '2024-02-01',
  },
  {
    id: '3',
    title: 'Hadith Master',
    description: 'Master 100 important Hadiths',
    difficulty: 'hard',
    participants: 650,
    completions: 120,
    status: 'active',
    createdAt: '2024-02-15',
  },
  {
    id: '4',
    title: 'Tajweed Workshop',
    description: 'Learn proper Quranic recitation',
    difficulty: 'medium',
    participants: 0,
    completions: 0,
    status: 'inactive',
    createdAt: '2024-02-20',
  },
];

function ChallengesPageContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [challenges] = useState<Challenge[]>(mockChallenges);

  const filteredChallenges = challenges.filter(
    (challenge) =>
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Trophy className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Challenges</h1>
            <p className="text-muted-foreground">Manage user challenges and gamification</p>
          </div>
        </div>
        <Link href="/admin/challenges/new">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            New Challenge
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Challenges Directory</CardTitle>
          <CardDescription>{filteredChallenges.length} challenge(s) found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Difficulty</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Participants</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Completions</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredChallenges.map((challenge) => (
                  <tr key={challenge.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4 font-medium text-foreground">{challenge.title}</td>
                    <td className="py-4 px-4">
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{challenge.participants.toLocaleString()}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{challenge.completions.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <Badge className={challenge.status === 'active' ? 'bg-primary' : 'bg-muted'}>
                        {challenge.status}
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
                            <Link href={`/admin/challenges/edit/${challenge.id}`} className="gap-2 flex items-center">
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
              <p className="text-3xl font-bold text-primary">{challenges.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Challenges</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">{challenges.reduce((sum, c) => sum + c.participants, 0).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Participants</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{challenges.filter((c) => c.status === 'active').length}</p>
              <p className="text-sm text-muted-foreground mt-1">Active</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ChallengesPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <ChallengesPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
