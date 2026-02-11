'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit2, Save, Info } from 'lucide-react';

interface AboutContent {
  title: string;
  tagline: string;
  description: string;
  mission: string;
  vision: string;
  values: string;
}

function AboutUsPageContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState<AboutContent>({
    title: 'About MK Project',
    tagline: 'Empowering Islamic Education Globally',
    description:
      'MK Project is a comprehensive Islamic learning platform dedicated to providing high-quality educational content, resources, and community engagement opportunities.',
    mission:
      'Our mission is to make Islamic education accessible, engaging, and impactful for learners worldwide through innovative technology and authentic content.',
    vision:
      'To become the leading global platform for Islamic education, fostering a community of informed, engaged, and empowered learners.',
    values:
      'Authenticity, Excellence, Inclusivity, Community, and Innovation - these are the core values that guide everything we do.',
  });

  const handleInputChange = (field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Info className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">About Us Page</h1>
            <p className="text-muted-foreground">Manage platform about page content</p>
          </div>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className={`gap-2 ${isEditing ? 'bg-secondary' : 'bg-primary'} hover:opacity-90`}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4" />
              Edit Page
            </>
          )}
        </Button>
      </div>

      {/* Preview Mode */}
      {!isEditing && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-primary via-primary/80 to-accent text-primary-foreground">
            <CardContent className="pt-8">
              <h1 className="text-4xl font-bold mb-2">{content.title}</h1>
              <p className="text-lg opacity-90">{content.tagline}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{content.description}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{content.mission}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{content.vision}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{content.values}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Edit About Page Content</CardTitle>
              <CardDescription>Update the content displayed on the About Us page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title" className="mb-2 block">
                  Page Title
                </Label>
                <Input
                  id="title"
                  value={content.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter page title"
                />
              </div>

              <div>
                <Label htmlFor="tagline" className="mb-2 block">
                  Tagline
                </Label>
                <Input
                  id="tagline"
                  value={content.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  placeholder="Enter tagline"
                />
              </div>

              <div>
                <Label htmlFor="description" className="mb-2 block">
                  Description
                </Label>
                <textarea
                  id="description"
                  value={content.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter description"
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <Label htmlFor="mission" className="mb-2 block">
                  Mission Statement
                </Label>
                <textarea
                  id="mission"
                  value={content.mission}
                  onChange={(e) => handleInputChange('mission', e.target.value)}
                  placeholder="Enter mission statement"
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <Label htmlFor="vision" className="mb-2 block">
                  Vision Statement
                </Label>
                <textarea
                  id="vision"
                  value={content.vision}
                  onChange={(e) => handleInputChange('vision', e.target.value)}
                  placeholder="Enter vision statement"
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <Label htmlFor="values" className="mb-2 block">
                  Core Values
                </Label>
                <textarea
                  id="values"
                  value={content.values}
                  onChange={(e) => handleInputChange('values', e.target.value)}
                  placeholder="Enter core values"
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function AboutUsPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <AboutUsPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
