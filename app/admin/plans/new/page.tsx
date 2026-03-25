'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { createPlan } from '@/services/auth.service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { I18nContext } from '@/i18n/provider';

export default function NewPlanPage() {
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
    description: '',
    price: '',
    currency: 'USD',
    duration: 'MONTHLY',
    status: 'ACTIVE'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createPlan({
        name: { en: formData.name },
        description: { en: formData.description },
        price: Number(formData.price),
        currency: formData.currency,
        duration: formData.duration as any,
        status: formData.status as any,
        modules: []
      });
      
      router.push('/admin/plans');
    } catch (error) {
      console.error('Failed to create plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-left">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-medium text-foreground">{t('translate.plans.createTitle')}</h1>
          <p className="text-sm text-muted-foreground">{t('translate.plans.createSubtitle')}</p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('translate.plans.createTitle')}</CardTitle>
          <CardDescription>{t('translate.plans.createSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('translate.plans.nameLabel')}</label>
                <Input 
                  required
                  placeholder="e.g. Enterprise Plan"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('translate.plans.priceLabel')}</label>
                <Input 
                  required
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>

              {/* Currency */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('translate.plans.currencyLabel')}</label>
                <Select value={formData.currency} onValueChange={(v) => setFormData({...formData, currency: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (â‚¬)</SelectItem>
                    <SelectItem value="INR">INR (â‚¹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('translate.plans.durationLabel')}</label>
                <Select value={formData.duration} onValueChange={(v) => setFormData({...formData, duration: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('translate.plans.selectDuration')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONTHLY">{t('translate.plans.interval_monthly').replace('/ ', '')}</SelectItem>
                    <SelectItem value="YEARLY">{t('translate.plans.interval_yearly').replace('/ ', '')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('translate.plans.statusLabel')}</label>
                <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('translate.plans.selectStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">{t('translate.plans.active')}</SelectItem>
                    <SelectItem value="INACTIVE">{t('translate.plans.inactive')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description (Full Width) */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">{t('translate.plans.descLabel')}</label>
                <Input 
                  placeholder="Plan description..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                {t('translate.plans.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {t('translate.plans.createBtn')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

