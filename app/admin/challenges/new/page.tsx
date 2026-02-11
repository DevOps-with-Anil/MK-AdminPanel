'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus } from 'lucide-react';

interface ChallengeForm {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  rewards: string;
  status: 'active' | 'inactive';
}

function NewChallengeContent() {
  const [formData, setFormData] = useState<ChallengeForm>({
    title: '',
    description: '',
    difficulty: 'easy',
    duration: '',
    rewards: '',
    status: 'active',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link href="/admin/challenges" className="flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Challenges
        </Link>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Create Challenge
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Challenge</CardTitle>
          <CardDescription>Add a new challenge to engage users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="title" className="mb-2 block">
              Challenge Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Challenge title"
            />
          </div>

          <div>
            <Label htmlFor="description" className="mb-2 block">
              Description
            </Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Challenge description"
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="difficulty" className="mb-2 block">
                Difficulty Level
              </Label>
              <select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <Label htmlFor="duration" className="mb-2 block">
                Duration (days)
              </Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                placeholder="Number of days"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="rewards" className="mb-2 block">
              Rewards
            </Label>
            <Input
              id="rewards"
              value={formData.rewards}
              onChange={(e) => handleChange('rewards', e.target.value)}
              placeholder="e.g., 100 points, Badge"
            />
          </div>

          <div>
            <Label htmlFor="status" className="mb-2 block">
              Status
            </Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewChallengePage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <NewChallengeContent />
      </AdminLayout>
    </AdminProvider>
  );
}
