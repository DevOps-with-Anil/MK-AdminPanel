'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, UserCircle, Award, Zap } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EndUserProfile } from '@/lib/types';

const mockEndUsers: EndUserProfile[] = [
  {
    id: 'USER001',
    email: 'student1@example.com',
    name: 'Ahmed Student',
    phone: '+91-9876543210',
    bio: { en: 'Passionate learner', hi: 'प्रतिभाशाली शिक्षार्थी', ar: 'متعلم متحمس' },
    interests: ['islamic-studies', 'technology'],
    certificationsCount: 3,
    totalPoints: 2450,
    level: 5,
    joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'USER002',
    email: 'student2@example.com',
    name: 'Fatima Learner',
    phone: '+971-501234567',
    bio: { en: 'Web developer', hi: 'वेब डेवलपर', ar: 'مطور ويب' },
    interests: ['technology'],
    certificationsCount: 5,
    totalPoints: 4120,
    level: 8,
    joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'USER003',
    email: 'student3@example.com',
    name: 'Hassan Scholar',
    phone: '+966-501234567',
    bio: { en: 'Knowledge seeker', hi: 'ज्ञान साधक', ar: 'طالب العلم' },
    interests: ['islamic-studies'],
    certificationsCount: 2,
    totalPoints: 1890,
    level: 4,
    joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function EndUsersPageContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<EndUserProfile[]>(mockEndUsers);
  const [selectedUser, setSelectedUser] = useState<EndUserProfile | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLevelColor = (level: number) => {
    if (level <= 3) return 'bg-blue-100 text-blue-800';
    if (level <= 6) return 'bg-purple-100 text-purple-800';
    return 'bg-gold-100 text-gold-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <UserCircle className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">End Users</h1>
            <p className="text-muted-foreground">Monitor and manage end user profiles and progress</p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>User Directory</CardTitle>
              <CardDescription>{filteredUsers.length} user(s) found</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Certifications</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead className="text-right">Last Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow
                          key={user.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedUser(user)}
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.id}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{user.email}</TableCell>
                          <TableCell>
                            <Badge className={getLevelColor(user.level)}>
                              Level {user.level}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Award className="w-4 h-4 text-yellow-500" />
                              {user.certificationsCount}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 font-semibold">
                              <Zap className="w-4 h-4 text-blue-500" />
                              {user.totalPoints}
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground">
                            {new Date(user.lastLoginAt || '').toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-0">
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedUser ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-semibold">{selectedUser.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="text-sm">{selectedUser.phone || '—'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Level</p>
                      <p className="text-2xl font-bold">{selectedUser.level}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Points</p>
                      <p className="text-2xl font-bold">{selectedUser.totalPoints}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Certifications</p>
                    <Badge variant="outline">{selectedUser.certificationsCount} earned</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Interests</p>
                    <div className="flex gap-2 flex-wrap">
                      {selectedUser.interests.map((interest) => (
                        <Badge key={interest} variant="secondary">{interest}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Select a user to view profile</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{users.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">{users.filter(u => u.level > 5).length}</p>
              <p className="text-sm text-muted-foreground mt-1">Advanced Level</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{users.reduce((sum, u) => sum + u.certificationsCount, 0)}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Certifications</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{users.reduce((sum, u) => sum + u.totalPoints, 0).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Points</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function EndUsersPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <EndUsersPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
