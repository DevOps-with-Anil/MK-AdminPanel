'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
// IMPORTS

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import {
  Building2,
  Mail,
  Phone,
  Calendar,
  Globe,
  FileText,
  Download,
  Eye,
  ShieldCheck,
  CheckCheck,
  Clock3,
  XCircle,
  ExternalLink,
  MapPin,
  CheckCheckIcon,
  CheckCircle2,
  CheckCircle2Icon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface KYBDocument {
  type: string;
  files: {
    name: string;
    url: string;
  }[];
}

interface KYBRequest {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  website?: string;
  country?: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  documents: KYBDocument[];
}

const request: KYBRequest = {
  id: 'KYB-1001',
  companyName: 'Veltrix Labs',
  email: 'contact@veltrixlabs.com',
  phone: '+91 9876543210',
  website: 'https://veltrixlabs.com',
  country: 'India',
  submittedAt: '2026-05-12',
  status: 'PENDING',
  documents: [
    {
      type: 'Business Registration Certificate',
      files: [
        {
          name: 'registration-certificate.pdf',
          url: '#',
        },
        {
          name: 'company-license.pdf',
          url: '#',
        },
      ],
    },
    {
      type: 'Tax Document',
      files: [
        {
          name: 'gst-document.pdf',
          url: '#',
        },
      ],
    },
    {
      type: 'Address Proof',
      files: [
        {
          name: 'office-address-proof.pdf',
          url: '#',
        },
      ],
    },
  ],
};

export default function VerificationDetailsPage() {
 
  return (
    <div className="space-y-2 pb-10">
      {/* HEADER */}

      {/* DOCUMENTS */}
      <Card className="shadow-sm border">
        <CardContent className="space-y-6">

          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-8">
            {/* LEFT CONTENT */}
            <div className="flex-1 space-y-5">
              {/* COMPANY INFO */}
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                {/* LEFT */}
                <div>
                  <CardTitle className="text-xl">
                    Uploaded Documents from {request.companyName}
                  </CardTitle>

                  <CardDescription className="mt-1 max-w-2xl text-md font-semibold">
                    KYB Request ID : {request.id}
                  </CardDescription>
                  {/* </div> */}

                  {/* RIGHT - SINGLE ROW */}
                  <div className="flex flex-wrap items-center gap-8 py-4">

                    {/* KYB SUBMITTED DATE */}
                    <div>
                      <div className="text-sm text-muted-foreground">
                        KYB Submitted Date
                      </div>
                      <div className="font-medium text-xm text-foreground mt-1">
                        12 May 2026 • 10:45 AM
                      </div>
                    </div>

                    {/* SUBMITTED BY */}
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Submitted By
                      </div>
                      <div className="font-medium text-xm text-foreground mt-1">
                        Rahul Sharma
                      </div>
                    </div>

                    {/* APPROVED BY */}
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Approved By
                      </div>
                      <div className="font-medium text-xm text-foreground mt-1">
                        Emma Wilson
                      </div>
                    </div>

                    {/* UPLOADED DATE */}
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Uploaded Date
                      </div>
                      <div className="font-medium text-xm text-foreground mt-1">
                        13 May 2026 • 03:22 PM
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT LOGO */}
            <div className="shrink-0">
              <div className="w-28 h-28 rounded-2xl border border-gray-300 bg-muted/20 flex items-center justify-center overflow-hidden">
                {request.logo ? (
                  <img
                    src={request.logo}
                    alt={request.companyName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
            </div>

          </div>

          {/* Documents View */}
          {request.documents.map((doc, index) => (
            <div
              key={index}
              className="rounded-2xl border overflow-hidden bg-muted/10"
            >
              {/* DOCUMENT TYPE VIEW*/}
              <div className="border-b bg-muted/20 px-5 py-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                  {/* LEFT */}
                  <div className="flex items-start gap-4">
                    <div className="space-y-2">
                      <div>
                        <div className="font-semibold text-base text-foreground">
                          {doc.type}
                        </div>

                        {/* DOCUMENT NUMBER */}
                        <div className="text-sm text-muted-foreground mt-1">
                          Document Number: DOC-2026-001245
                        </div>

                        {/* VALIDITY */}
                        <div className="text-sm text-muted-foreground">
                          Valid Until: 12 Dec 2028
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex items-center gap-3">
                    {/* APPROVE */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700">
                          <CheckCircle2Icon className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            Approve {doc.type}
                          </DialogTitle>

                          <DialogDescription>
                            Verification Notes
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 pt-2">
                          {/* INTERNAL NOTE */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm font-semibold text-foreground">
                                  Internal Review Notes
                                </h3>

                                <p className="text-xs text-muted-foreground mt-1">
                                  Visible only to admins and compliance reviewers.
                                </p>
                              </div>

                              <div className="px-2.5 py-1 rounded-md bg-red-500 text-sm font-medium text-white">
                                Private
                              </div>
                            </div>

                            <Textarea
                              rows={5}
                              placeholder="Write internal compliance observations, reviewer comments, missing document remarks, or investigation notes..."
                              className="resize-none"
                            />
                          </div>

                          {/* TENANT NOTE */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm font-semibold text-foreground">
                                  Tenant Notes
                                </h3>

                                <p className="text-xs text-muted-foreground mt-1">
                                  This message will be visible to the tenant/company.
                                </p>
                              </div>

                              <div className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-sm font-medium border border-blue-200">
                                Visible to Tenant
                              </div>
                            </div>

                            <Textarea
                              rows={5}
                              placeholder="Write approval notes, onboarding remarks, or document validation comments..."
                              className="resize-none"
                            />
                          </div>

                          {/* ACTIONS */}
                          <div className="flex justify-end gap-3 pt-2">
                            <DialogClose asChild>
                              <Button variant="outline">
                                Cancel
                              </Button>
                            </DialogClose>

                            <Button className="bg-green-600 hover:bg-green-700">
                              <CheckCheck className="w-4 h-4 mr-2" />
                              Confirm Approval
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* REJECT */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive">
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            Reject {doc.type}
                          </DialogTitle>

                          <DialogDescription>
                            Add rejection notes and compliance remarks.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 pt-2">
                          {/* INTERNAL NOTE */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm font-semibold text-foreground">
                                  Internal Review Notes
                                </h3>

                                <p className="text-xs text-muted-foreground mt-1">
                                  Visible only to admins and compliance reviewers.
                                </p>
                              </div>

                              <div className="px-2.5 py-1 rounded-md bg-red-500 text-sm font-medium text-white">
                                Private
                              </div>
                            </div>

                            <Textarea
                              rows={5}
                              placeholder="Write rejection observations, fraud concerns, missing fields, or compliance issues..."
                              className="resize-none"
                            />
                          </div>

                          {/* TENANT NOTE */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm font-semibold text-foreground">
                                  Tenant Notes
                                </h3>

                                <p className="text-xs text-muted-foreground mt-1">
                                  This message will be visible to the tenant/company.
                                </p>
                              </div>

                              <div className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-sm font-medium border border-blue-200">
                                Visible to Tenant
                              </div>
                            </div>

                            <Textarea
                              rows={5}
                              placeholder="Write rejection reason, missing document request, or next required actions..."
                              className="resize-none"
                            />
                          </div>

                          {/* ACTIONS */}
                          <div className="flex justify-end gap-3 pt-2">
                            <DialogClose asChild>
                              <Button variant="outline">
                                Cancel
                              </Button>
                            </DialogClose>

                            <Button variant="destructive">
                              <XCircle className="w-4 h-4 mr-2" />
                              Confirm Rejection
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

              {/* FILE GRID */}
              <div className="p-2 grid grid-cols-3 md:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-2.5">
                {doc.files.map((file, fileIndex) => {
                  const extension =
                    file.name.split('.').pop()?.toLowerCase() || '';

                  const isImage = [
                    'png',
                    'jpg',
                    'jpeg',
                    'webp',
                    'gif',
                  ].includes(extension);

                  const isPDF = extension === 'pdf';

                  const isVideo = [
                    'mp4',
                    'mov',
                    'webm',
                  ].includes(extension);

                  return (
                    <div
                      key={fileIndex}
                      className="group rounded-xl border bg-background overflow-hidden hover:shadow-md transition-all duration-300"
                    >
                      {/* PREVIEW AREA */}
                      <div className="aspect-square border-b bg-muted/20 relative overflow-hidden">
                        {/* IMAGE */}
                        {isImage && (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        )}

                        {/* PDF */}
                        {isPDF && (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-red-50 to-red-100">
                            <FileText className="w-10 h-10 text-red-500 mb-2" />

                            <div className="text-[11px] font-medium text-red-600">
                              PDF
                            </div>
                          </div>
                        )}

                        {/* VIDEO */}
                        {isVideo && (
                          <video
                            src={file.url}
                            className="w-full h-full object-cover"
                          />
                        )}

                        {/* OTHER FILE */}
                        {!isImage && !isPDF && !isVideo && (
                          <div className="w-full h-full flex flex-col items-center justify-center">
                            <FileText className="w-10 h-10 text-primary mb-2" />

                            <div className="text-[11px] font-medium">
                              FILE
                            </div>
                          </div>
                        )}

                        {/* FILE TYPE */}
                        <div className="absolute top-2 right-2 z-10">
                          <div className="px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] uppercase tracking-wide">
                            {extension}
                          </div>
                        </div>

                        {/* HOVER ACTIONS */}
                        <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 bg-white text-black hover:bg-white/90"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* FILE INFO */}
                      <div className="p-3">
                        <div className="truncate text-sm font-medium text-foreground">
                          {file.name}
                        </div>

                        <div className="flex items-center justify-between mt-1 text-[14px] text-muted-foreground">
                          <span>2.4 MB</span>
                          <span>PDF</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ))}

        </CardContent>

      </Card>

    </div>
  );
}