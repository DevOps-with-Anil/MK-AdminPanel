'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, Users, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Campaign } from '@/lib/types';
import { getLocalizedText, initializeMultiLang } from '@/i18n/langHelper';
import MultiLangInput from '@/components/common/MultiLangInput';
import { Label } from '@/components/ui/label';

const mockCampaigns: Campaign[] = [
  {
    id: 'CAMP001',
    title: { en: 'Summer Learning Campaign', hi: 'गर्मी सीखने का अभियान', ar: 'حملة التعلم الصيفي' },
    description: { en: 'Special discounts for summer courses', hi: 'गर्मी के पाठ्यक्रमों के लिए विशेष छूट', ar: 'خصومات خاصة لدورات الصيف' },
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    targetAudience: ['students', 'professionals'],
    participantsCount: 1240,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'CAMP002',
    title: { en: 'Referral Program', hi: 'रेफरल प्रोग्राम', ar: 'برنامج الإحالة' },
    description: { en: 'Earn rewards by referring friends', hi: 'दोस्तों को संदर्भित करके पुरस्कार अर्जित करें', ar: 'اكسب المكافآت بإحالة الأصدقاء' },
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    targetAudience: ['existing-users'],
    participantsCount: 3420,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'CAMP003',
    title: { en: 'Year End Mega Sale', hi: 'साल का अंत मेगा सेल', ar: 'بيع ميجا نهاية السنة' },
    description: { en: 'Biggest sale of the year', hi: 'साल की सबसे बड़ी बिक्री', ar: 'أكبر بيع في السنة' },
    startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'draft',
    targetAudience: ['all'],
    participantsCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function CampaignsPageContent() {
  const { currentLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      getLocalizedText(campaign.title, currentLanguage).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCampaign = () => {
    setEditingCampaign(null);
    setIsFormOpen(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsFormOpen(true);
  };

  const handleDeleteCampaign = (campaignId: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(campaigns.filter(c => c.id !== campaignId));
      if (selectedCampaign?.id === campaignId) {
        setSelectedCampaign(null);
      }
    }
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Zap className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Campaigns & Projects</h1>
            <p className="text-muted-foreground">Manage marketing campaigns and promotional projects</p>
          </div>
        </div>
        <Button onClick={handleAddCampaign} className="gap-2">
          <Plus className="w-4 h-4" />
          New Campaign
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search campaigns..."
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
              <CardTitle>Active Campaigns</CardTitle>
              <CardDescription>{filteredCampaigns.length} campaign(s) found</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCampaigns.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No campaigns found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCampaigns.map((campaign) => (
                        <TableRow
                          key={campaign.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedCampaign(campaign)}
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">{getLocalizedText(campaign.title, currentLanguage)}</p>
                              <p className="text-xs text-muted-foreground">{campaign.id}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {campaign.participantsCount}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(campaign.endDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCampaign(campaign);
                              }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCampaign(campaign.id);
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
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedCampaign ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Title</p>
                    <p className="font-semibold">{getLocalizedText(selectedCampaign.title, currentLanguage)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-sm">{getLocalizedText(selectedCampaign.description, currentLanguage)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <Badge className={getStatusBadgeColor(selectedCampaign.status)} variant="outline">
                        {selectedCampaign.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Participants</p>
                      <p className="text-lg font-semibold">{selectedCampaign.participantsCount}</p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Select a campaign to view details</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Campaign Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <MultiLangInput
              label="Campaign Title"
              value={editingCampaign?.title || initializeMultiLang()}
              onChange={() => {}}
            />
            <MultiLangInput
              label="Description"
              value={editingCampaign?.description || initializeMultiLang()}
              onChange={() => {}}
              multiline
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  defaultValue={new Date(editingCampaign?.startDate || '').toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  defaultValue={new Date(editingCampaign?.endDate || '').toISOString().split('T')[0]}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button className="flex-1">Save Campaign</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CampaignsPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <CampaignsPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
