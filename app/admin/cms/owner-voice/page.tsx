'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, Microphone, Video, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OwnerVoice } from '@/lib/types';
import { getLocalizedText, initializeMultiLang } from '@/i18n/langHelper';
import MultiLangInput from '@/components/common/MultiLangInput';
import { Label } from '@/components/ui/label';

const mockOwnerVoices: OwnerVoice[] = [
  {
    id: 'OV001',
    title: { en: 'Welcome to Our Platform', hi: 'हमारे प्लेटफॉर्म में आपका स्वागत है', ar: 'أهلا بك في منصتنا' },
    description: { en: 'Introduction video from founder', hi: 'संस्थापक से परिचय वीडियो', ar: 'فيديو تقديم من المؤسس' },
    content: 'Introduction message...',
    mediaType: 'video',
    mediaUrl: 'https://example.com/videos/welcome.mp4',
    duration: 480,
    published: true,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'OV002',
    title: { en: 'Behind the Scenes', hi: 'दृश्यों के पीछे', ar: 'خلف الكواليس' },
    description: { en: 'Inside look at our operations', hi: 'हमारे संचालन का अंदरूनी दृश्य', ar: 'نظرة داخلية على عملياتنا' },
    content: 'Behind the scenes message...',
    mediaType: 'audio',
    mediaUrl: 'https://example.com/audio/behind-scenes.mp3',
    duration: 600,
    published: true,
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'OV003',
    title: { en: 'Future Vision', hi: 'भविष्य की दृष्टि', ar: 'رؤية المستقبل' },
    description: { en: 'Our vision for the next 5 years', hi: 'अगले 5 साल के लिए हमारा दृष्टिकोण', ar: 'رؤيتنا للسنوات الخمس القادمة' },
    content: 'Future vision message...',
    mediaType: 'video',
    mediaUrl: 'https://example.com/videos/vision.mp4',
    duration: 720,
    published: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function OwnerVoicePageContent() {
  const { currentLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [voices, setVoices] = useState<OwnerVoice[]>(mockOwnerVoices);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVoice, setEditingVoice] = useState<OwnerVoice | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<OwnerVoice | null>(null);

  const filteredVoices = voices.filter(
    (voice) =>
      getLocalizedText(voice.title, currentLanguage).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddVoice = () => {
    setEditingVoice(null);
    setIsFormOpen(true);
  };

  const handleEditVoice = (voice: OwnerVoice) => {
    setEditingVoice(voice);
    setIsFormOpen(true);
  };

  const handleDeleteVoice = (voiceId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setVoices(voices.filter(v => v.id !== voiceId));
      if (selectedVoice?.id === voiceId) {
        setSelectedVoice(null);
      }
    }
  };

  const handleTogglePublish = (voice: OwnerVoice) => {
    setVoices(
      voices.map(v =>
        v.id === voice.id
          ? { ...v, published: !v.published, publishedAt: !v.published ? new Date().toISOString() : undefined }
          : v
      )
    );
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Microphone className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Owner Voice</h1>
            <p className="text-muted-foreground">Share audio and video messages from leadership</p>
          </div>
        </div>
        <Button onClick={handleAddVoice} className="gap-2">
          <Plus className="w-4 h-4" />
          New Message
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search messages..."
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
              <CardTitle>Messages</CardTitle>
              <CardDescription>{filteredVoices.length} message(s) found</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No messages found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredVoices.map((voice) => (
                        <TableRow
                          key={voice.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedVoice(voice)}
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">{getLocalizedText(voice.title, currentLanguage)}</p>
                              <p className="text-xs text-muted-foreground">{voice.id}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="gap-1">
                              {voice.mediaType === 'video' ? (
                                <>
                                  <Video className="w-3 h-3" />
                                  Video
                                </>
                              ) : (
                                <>
                                  <Microphone className="w-3 h-3" />
                                  Audio
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {voice.duration ? formatDuration(voice.duration) : '—'}
                          </TableCell>
                          <TableCell>
                            <Badge className={voice.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {voice.published ? 'Published' : 'Draft'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditVoice(voice);
                              }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteVoice(voice.id);
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
              <CardTitle>Message Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedVoice ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Title</p>
                    <p className="font-semibold">{getLocalizedText(selectedVoice.title, currentLanguage)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-sm">{getLocalizedText(selectedVoice.description, currentLanguage) || '—'}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Type</span>
                      <Badge variant="outline" className="gap-1">
                        {selectedVoice.mediaType === 'video' ? (
                          <>
                            <Video className="w-3 h-3" />
                            Video
                          </>
                        ) : (
                          <>
                            <Microphone className="w-3 h-3" />
                            Audio
                          </>
                        )}
                      </Badge>
                    </div>
                    {selectedVoice.duration && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Duration</span>
                        <span className="text-sm font-semibold">{formatDuration(selectedVoice.duration)}</span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleTogglePublish(selectedVoice)}
                  >
                    {selectedVoice.published ? 'Unpublish' : 'Publish'}
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Select a message to view details</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Voice Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingVoice ? 'Edit Message' : 'Create New Message'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <MultiLangInput
              label="Message Title"
              value={editingVoice?.title || initializeMultiLang()}
              onChange={() => {}}
            />
            <MultiLangInput
              label="Description"
              value={editingVoice?.description || initializeMultiLang()}
              onChange={() => {}}
              multiline
            />
            <div className="space-y-2">
              <Label htmlFor="media-type">Media Type</Label>
              <select
                id="media-type"
                defaultValue={editingVoice?.mediaType || 'video'}
                className="w-full px-3 py-2 border border-border rounded-md"
              >
                <option value="audio">Audio</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="media-url">Media URL</Label>
              <Input
                id="media-url"
                defaultValue={editingVoice?.mediaUrl}
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button className="flex-1">Save Message</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function OwnerVoicePage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <OwnerVoicePageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
