'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Mail, Phone, MapPin, Share2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactPageInfo, ContactFormField } from '@/lib/types';
import MultiLangInput from '@/components/common/MultiLangInput';
import { initializeMultiLang } from '@/i18n/langHelper';

const mockContactPage: ContactPageInfo = {
  id: 'CONTACT001',
  tenantId: 'TENANT001',
  heading: { en: 'Get in Touch', hi: 'हमसे संपर्क करें', ar: 'تواصل معنا' },
  description: { en: 'Have questions? We would love to hear from you. Send us a message!', hi: 'सवाल हैं? हम आपकी बात सुनना चाहते हैं। हमें एक संदेश भेजें!', ar: 'هل لديك أسئلة؟ نود أن نسمع منك. أرسل لنا رسالة!' },
  email: 'contact@example.com',
  phone: '+91-9876543210',
  address: { en: '123 Main Street, Delhi', hi: '१२३ मुख्य सड़क, दिल्ली', ar: '123 شارع رئيسي، دلهي' },
  socialLinks: {
    twitter: 'https://twitter.com/example',
    facebook: 'https://facebook.com/example',
    linkedin: 'https://linkedin.com/company/example',
  },
  formFields: [
    {
      id: 'FIELD001',
      type: 'text',
      label: { en: 'Name', hi: 'नाम', ar: 'الاسم' },
      required: true,
      order: 1,
    },
    {
      id: 'FIELD002',
      type: 'email',
      label: { en: 'Email', hi: 'ईमेल', ar: 'بريد إلكتروني' },
      required: true,
      order: 2,
    },
    {
      id: 'FIELD003',
      type: 'select',
      label: { en: 'Subject', hi: 'विषय', ar: 'الموضوع' },
      required: true,
      order: 3,
      options: ['General Inquiry', 'Support', 'Partnership', 'Feedback'],
    },
    {
      id: 'FIELD004',
      type: 'textarea',
      label: { en: 'Message', hi: 'संदेश', ar: 'رسالة' },
      required: true,
      order: 4,
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function ContactPageContent() {
  const [contactPage, setContactPage] = useState<ContactPageInfo>(mockContactPage);
  const [formFields, setFormFields] = useState<ContactFormField[]>(mockContactPage.formFields);
  const [newField, setNewField] = useState<Partial<ContactFormField>>({
    type: 'text',
    required: false,
  });

  const handleAddField = () => {
    if (!newField.label?.en?.trim()) {
      alert('Field label is required');
      return;
    }

    const field: ContactFormField = {
      id: `FIELD${Date.now()}`,
      type: newField.type || 'text',
      label: newField.label || initializeMultiLang(),
      required: newField.required || false,
      order: formFields.length + 1,
      options: newField.options,
    };

    setFormFields([...formFields, field]);
    setNewField({ type: 'text', required: false });
  };

  const handleDeleteField = (fieldId: string) => {
    if (confirm('Are you sure you want to delete this field?')) {
      setFormFields(formFields.filter(f => f.id !== fieldId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Share2 className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contact Page</h1>
            <p className="text-muted-foreground">Manage contact information and contact form fields</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Contact Info</TabsTrigger>
          <TabsTrigger value="form">Form Fields</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
        </TabsList>

        {/* Contact Info Tab */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Update your contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <MultiLangInput
                  label="Page Heading"
                  value={contactPage.heading}
                  onChange={(value) => setContactPage({ ...contactPage, heading: value })}
                />
              </div>
              <div>
                <MultiLangInput
                  label="Page Description"
                  value={contactPage.description}
                  onChange={(value) => setContactPage({ ...contactPage, description: value })}
                  multiline
                />
              </div>
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold">Contact Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input
                      type="email"
                      value={contactPage.email}
                      onChange={(e) => setContactPage({ ...contactPage, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </Label>
                    <Input
                      type="tel"
                      value={contactPage.phone}
                      onChange={(e) => setContactPage({ ...contactPage, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </Label>
                  <div className="border border-border rounded-md p-3 space-y-2">
                    <Input
                      placeholder="English"
                      defaultValue={contactPage.address?.en}
                      onChange={(e) =>
                        setContactPage({
                          ...contactPage,
                          address: {
                            ...contactPage.address,
                            en: e.target.value,
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="Hindi"
                      defaultValue={contactPage.address?.hi}
                      onChange={(e) =>
                        setContactPage({
                          ...contactPage,
                          address: {
                            ...contactPage.address,
                            hi: e.target.value,
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="Arabic"
                      defaultValue={contactPage.address?.ar}
                      onChange={(e) =>
                        setContactPage({
                          ...contactPage,
                          address: {
                            ...contactPage.address,
                            ar: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <Button className="w-full">Save Contact Information</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Form Fields Tab */}
        <TabsContent value="form" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Contact Form Fields</CardTitle>
                <CardDescription>Manage the fields in your contact form</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold">Add New Field</h3>
                <MultiLangInput
                  label="Field Label"
                  value={newField.label || initializeMultiLang()}
                  onChange={(value) => setNewField({ ...newField, label: value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="field-type">Field Type</Label>
                    <select
                      id="field-type"
                      value={newField.type || 'text'}
                      onChange={(e) => setNewField({ ...newField, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-border rounded-md"
                    >
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="textarea">Textarea</option>
                      <option value="select">Select</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newField.required || false}
                        onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                        className="w-4 h-4 rounded border-border"
                      />
                      <span className="text-sm">Required</span>
                    </label>
                  </div>
                </div>
                <Button onClick={handleAddField} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Field
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Current Fields</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Label</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Required</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formFields.map((field) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{field.label.en}</p>
                              <p className="text-xs text-muted-foreground">{field.id}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{field.type}</Badge>
                          </TableCell>
                          <TableCell>
                            {field.required ? (
                              <Badge className="bg-red-100 text-red-800">Yes</Badge>
                            ) : (
                              <Badge variant="secondary">No</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteField(field.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links Tab */}
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Add your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    placeholder="https://twitter.com/..."
                    defaultValue={contactPage.socialLinks?.twitter}
                    onChange={(e) =>
                      setContactPage({
                        ...contactPage,
                        socialLinks: {
                          ...contactPage.socialLinks,
                          twitter: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    placeholder="https://facebook.com/..."
                    defaultValue={contactPage.socialLinks?.facebook}
                    onChange={(e) =>
                      setContactPage({
                        ...contactPage,
                        socialLinks: {
                          ...contactPage.socialLinks,
                          facebook: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/..."
                    defaultValue={contactPage.socialLinks?.linkedin}
                    onChange={(e) =>
                      setContactPage({
                        ...contactPage,
                        socialLinks: {
                          ...contactPage.socialLinks,
                          linkedin: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <Button className="w-full">Save Social Links</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function ContactPageManagement() {
  return (
    <AdminProvider>
      <AdminLayout>
        <ContactPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
