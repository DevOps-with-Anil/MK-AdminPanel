'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { I18nContext } from '@/i18n/provider';

const ROLE_OPTIONS = [
  { id: 'root-admin-role', nameKey: 'roles.rootAdmin' },
  { id: 'affiliate-admin-role', nameKey: 'roles.affiliateAdmin' },
];

export default function NewUserPage() {
  const router = useRouter();
  const { messages } = useContext(I18nContext);
  const t = (key: string, placeholders?: Record<string, string | number>) => {
    const normalizedKey = key.replace(/^translate\./, '');
    let value = messages.translate?.[normalizedKey] || key;

    if (placeholders) {
      for (const [ph, phValue] of Object.entries(placeholders)) {
        value = value.replace(`{{${ph}}}`, String(phValue));
        value = value.replace(`{${ph}}`, String(phValue));
      }
    }

    return value;
  };
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    status: 'active'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log('User created:', formData);
      setIsLoading(false);
      router.push('/admin/users');
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-left">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-medium text-foreground">{t('translate.users.createTitle')}</h1>
          <p className="text-sm text-muted-foreground">{t('translate.users.createSubtitle')}</p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('translate.users.createTitle')}</CardTitle>
          <CardDescription>{t('translate.users.createSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('translate.users.name')}</label>
              <Input 
                required
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('translate.users.email')}</label>
              <Input 
                required
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('translate.users.password')}</label>
              <Input 
                required
                type="password"
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('translate.users.role')}</label>
              <Select value={formData.role} onValueChange={(v) => setFormData({...formData, role: v})}>
                <SelectTrigger>
                  <SelectValue placeholder={t('translate.users.selectRole')} />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {t(role.nameKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('translate.users.status')}</label>
              <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t('translate.users.active')}</SelectItem>
                  <SelectItem value="inactive">{t('translate.users.inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                {t('translate.plans.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {t('translate.users.createBtn')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

