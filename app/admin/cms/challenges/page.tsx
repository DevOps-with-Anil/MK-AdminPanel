'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, Users, Trophy, Radio, MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTabs } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Challenge } from '@/lib/types';
import { getLocalizedText, initializeMultiLang } from '@/i18n/langHelper';
import MultiLangInput from '@/components/common/MultiLangInput';
import { Label } from '@/components/ui/label';

const mockChallenges: Challenge[] = [
  {
    id: 'CHAL001',
    title: { en: 'JavaScript Basics', hi: 'जावास्क्रिप्ट की मूल बातें', ar: 'أساسيات جافا سكريبت' },
    content: { en: 'Learn JS basics', hi: 'JS की मूल बातें जानें', ar: 'تعلم أساسيات JS' },
    difficulty: 'easy',
    duration: 7,
    maxParticipants: 100,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    published: true,
    participants: 45,
    votes: 234,
    comments: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'CHAL002',
    title: { en: 'React Advanced', hi: 'रिएक्ट उन्नत', ar: 'React متقدم' },
    content: { en: 'Advanced React patterns', hi: 'उन्नत React पैटर्न', ar: 'أنماط React المتقدمة' },
    difficulty: 'hard',
    duration: 14,
    maxParticipants: 50,
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    published: false,
    participants: 0,
    votes: 0,
    comments: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function ChallengesPageContent() {
  const { currentLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [detailsTab, setDetailsTab] = useState('participants');

  const filteredChallenges = challenges.filter(
    (challenge) =>
      getLocalizedText(challenge.title, currentLanguage).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddChallenge = () => {
    setEditingChallenge(null);
    setIsFormOpen(true);
  };

  const handleEditChallenge = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setIsFormOpen(true);
  };

  const handleDeleteChallenge = (challengeId: string) => {
    if (confirm('Are you sure you want to delete this challenge?')) {
      setChallenges(challenges.filter(c => c.id !== challengeId));
      if (selectedChallenge?.id === challengeId) {
        setSelectedChallenge(null);
      }
    }
  };

  const handleTogglePublish = (challenge: Challenge) => {
    setChallenges(
      challenges.map(c =>
        c.id === challenge.id ? { ...c, published: !c.published } : c
      )
    );
  };

  const getDifficultyBadgeColor = (difficulty: string) => {
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
            <p className="text-muted-foreground">Manage challenges with participants, voting, and live streams</p>
          </div>
        </div>
        <Button onClick={handleAddChallenge} className="gap-2">
          <Plus className="w-4 h-4" />
          New Challenge
        </Button>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Active Challenges</CardTitle>
              <CardDescription>{filteredChallenges.length} challenge(s) found</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredChallenges.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No challenges found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredChallenges.map((challenge) => (
                        <TableRow
                          key={challenge.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedChallenge(challenge)}
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">{getLocalizedText(challenge.title, currentLanguage)}</p>
                              <p className="text-xs text-muted-foreground">{challenge.id}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getDifficultyBadgeColor(challenge.difficulty)}>
                              {challenge.difficulty}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Users className="w-4 h-4" />
                              {challenge.participants}/{challenge.maxParticipants}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={challenge.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {challenge.published ? 'Published' : 'Draft'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditChallenge(challenge);
                              }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteChallenge(challenge.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
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
              <CardTitle>Challenge Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedChallenge ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Title</p>
                    <p className="font-semibold">{getLocalizedText(selectedChallenge.title, currentLanguage)}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 p-3 bg-muted rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 font-semibold">
                        <Users className="w-4 h-4" />
                        {selectedChallenge.participants}
                      </div>
                      <p className="text-xs text-muted-foreground">Participants</p>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{selectedChallenge.votes}</div>
                      <p className="text-xs text-muted-foreground">Votes</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 font-semibold">
                        <MessageCircle className="w-4 h-4" />
                        {selectedChallenge.comments}
                      </div>
                      <p className="text-xs text-muted-foreground">Comments</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleTogglePublish(selectedChallenge)}
                  >
                    {selectedChallenge.published ? 'Unpublish' : 'Publish'}
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Select a challenge to view details</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Challenge Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingChallenge ? 'Edit Challenge' : 'Create New Challenge'}
            </DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="live">Live Links</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <MultiLangInput
                label="Challenge Title"
                value={editingChallenge?.title || initializeMultiLang()}
                onChange={() => {}}
              />
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <select
                  id="difficulty"
                  defaultValue={editingChallenge?.difficulty || 'easy'}
                  className="w-full px-3 py-2 border border-border rounded-md"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    defaultValue={editingChallenge?.duration || 7}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-participants">Max Participants</Label>
                  <Input
                    id="max-participants"
                    type="number"
                    defaultValue={editingChallenge?.maxParticipants || 100}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="live" className="space-y-4">
              <div className="space-y-2">
                <Label>Live Broadcast Links</Label>
                <div className="space-y-2">
                  <div className="p-3 border border-border rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium">Live Stream 1</span>
                    </div>
                    <Input placeholder="https://..." />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsFormOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button className="flex-1">Save Challenge</Button>
          </div>
        </DialogContent>
      </Dialog>
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
