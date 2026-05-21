'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { useParams, useRouter } from 'next/navigation';
import {
  useEffect,
  useState,
  useContext,
  useCallback,
} from 'react';

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


import { I18nContext } from '@/i18n/provider';
import { LANGUAGES, DEFAULT_LANGUAGE, Language } from '@/i18n/languages';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MultiLangTabs } from '@/components/common/MultiLangTabs';
import { MultiLangTextarea } from '@/components/common/MultiLangTextarea';

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
  Badge,
  ImageIcon,
  ZoomOut,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  Dock,
  File,
  MoveRight,
  CheckCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getTenantKYB, updateKYBStatus } from '@/services/auth.service';
import { json } from 'stream/consumers';
import { formatDate } from "@/utils/dateFormatter";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Document from 'next/document';



interface KYBDocument {
  documentId: string;
  type: string;
  label: string;
  description: string;
  documentNumber: string;
  status: string;
  issueDate: string;
  expiryDate: string;
  files: string[];
  createdAt: string;
  updatedAt: string;
}

interface Tenant {
  _id: string;
  companyName: string;
  contact: {
    email: string;
    phone: {
      code: string;
      number: string;
    };
  };
  logo: string
};

interface KYBResponse {
  id: string;
  KYBID: string;
  status:
  | 'UPLOADED'
  | 'APPROVED'
  | 'REJECTED';
  verifiedBy: string | null;
  submittedBY: string;
  submittedByUserType:
  | 'ROOT'
  | 'TENANT';
  createdAt: string;
  updatedAt: string;
  tenantId: Tenant;
  documents: KYBDocument[];
}

interface KYBInternalReviewNote {
  description: MultiLangText;
}

interface KYBTenantReviewNote {
  description: MultiLangText;
}

type MultiLang<T> = Record<Language, T>;
type MultiLangText = MultiLang<string>;

const languageKeys = Object.keys(LANGUAGES) as Language[];

const createMultiLangObject = (): MultiLangText =>
  languageKeys.reduce((acc, lang) => {
    acc[lang] = '';
    return acc;
  }, {} as MultiLangText);

export default function VerificationDetailsPage() {

  const params = useParams();
  const router = useRouter();

  const { locale } = useContext(I18nContext);
  const [currentLang, setCurrentLang] = useState<Language>(locale);

  const [loading, setLoading] = useState(false);
  const [kybData, setKYBData] = useState<KYBResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0,
  });

  const [formData, setFormData] = useState({
    internal: {
      description: createMultiLangObject(),
    },
    tenant: {
      description: createMultiLangObject(),
    },
  });

  useEffect(() => {
    const fetchKYBDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getTenantKYB(params.id as string);
        console.log('API RESPONSE : ', JSON.stringify(res));
        setKYBData(res.data);

      } catch (err: any) {
        console.error('KYB Fetch Error:', err);

        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchKYBDetails();
    }
  }, [params?.id]);


  // SEPARATE useEffect FOR DEBUGGING
  useEffect(() => {
    if (kybData) {
      console.log(
        'Company Name : ',
        kybData?.tenantId?.companyName
      );
    }
  }, [kybData]);

  // Download documets
  const handleDownloadFile = async (
    fileUrl: string,
    fileName?: string
  ) => {
    try {
      const response = await fetch(fileUrl);

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download =
        fileName ||
        fileUrl.split("/").pop() ||
        "download";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  const handleInternalChange = (lang: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      internal: {
        ...prev.internal,
        description: {
          ...prev.internal.description,
          [lang]: value,
        },
      },
    }));
  };

  const handleTenantChange = (lang: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      tenant: {
        ...prev.tenant,
        description: {
          ...prev.tenant.description,
          [lang]: value,
        },
      },
    }));
  };

  const handleConfirmApprove = async (
    documentId: string,
    tenantId: string
  ) => {
    try {
      setLoading(true);

      const res = await updateKYBStatus({
        tenantId,
        documentId,
        status: "APPROVED",
        public_comment: formData.tenant.description,
        internal_comment: formData.internal.description,
      });

      console.log('API RESPONSE : ', JSON.stringify(res));
      alert('API RESPONSE : ' + (res.message));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleConfirmReject = async (
    documentId: string,
    tenantId: string
  ) => {
    try {
      setLoading(true);

      const res = await updateKYBStatus({
        tenantId,
        documentId,
        status: "REJECTED",
        public_comment: formData.tenant.description,
        internal_comment: formData.internal.description,
      });

      console.log('API RESPONSE : ', JSON.stringify(res));
      alert('API RESPONSE : ' + (res.message));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }

  };


  return (
    <div className="space-y-2 pb-10">
      {/* HEADER */}

      {/* DOCUMENTS */}
      <Card className="shadow-sm border">
        <CardContent className="space-y-6">

          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-8">

            {/* LEFT CONTENT */}
            <div className="flex-1">

              <div className="space-y-4">

                {/* PAGE TITLE */}
                <div>
                  <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                    KYB Verification Documents
                  </h1>

                  <p className="text-sm text-muted-foreground mt-1">
                    Review and verify uploaded business compliance documents.
                  </p>
                </div>

                {/* COMPANY DETAILS */}
                <div className="space-y-2">

                  {/* COMPANY NAME */}
                  <div className="text-xl font-semibold text-foreground">
                    {kybData?.tenantId?.companyName}
                  </div>

                  {/* META INFO */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">

                    {/* KYB ID */}
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        KYB Request ID:
                      </span>

                      <span className="font-medium text-foreground">
                        {kybData?.KYBID}
                      </span>
                    </div>

                    <div className="h-4 w-px bg-border" />

                    {/* SUBMITTED DATE */}
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        Submitted on:
                      </span>

                      <span className="font-medium text-foreground">
                        {formatDate(kybData?.createdAt)}
                      </span>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT LOGO */}
            <div className="shrink-0">
              <div className="w-28 h-28 rounded-2xl border border-border bg-muted/20 flex items-center justify-center overflow-hidden shadow-sm">

                {kybData?.tenantId?.logo ? (
                  <img
                    src={kybData?.tenantId?.logo}
                    alt={kybData?.tenantId?.companyName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-12 h-12 text-muted-foreground" />
                )}

              </div>
            </div>

          </div>

          {/* Documents View */}
          {kybData?.documents?.map((doc, index) => (
            <div
              key={doc.documentId || index}
              className="rounded-2xl border overflow-hidden bg-muted/10"
            >
              {/* DOCUMENT TYPE VIEW */}
              {/* DOCUMENT TYPE VIEW */}
              <div className="border-b bg-muted/20 px-5 py-4 border-gray-300">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                  {/* LEFT */}
                  <div className="flex-1 space-y-5">

                    {/* TITLE */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">

                          {/* DOC LABEL */}
                          <div className="font-semibold text-base text-foreground">
                            {doc.label || doc.type}
                          </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="text-sm text-muted-foreground mt-1">
                          {doc.description || 'No description available'}
                        </div>
                      </div>
                    </div>

                    {/* FORM DETAILS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                      {/* DOCUMENT NUMBER */}
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          Document Number
                        </div>

                        <div className="font-medium text-md text-foreground">
                          {doc.documentNumber || 'N/A'}
                        </div>
                      </div>

                      {/* ISSUE DATE */}
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          Valid From
                        </div>

                        <div className="font-medium text-md text-foreground">

                          {formatDate(
                            doc.issueDate
                          )}
                        </div>
                      </div>

                      {/* EXPIRY DATE */}
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          Valid To
                        </div>

                        <div className="font-medium text-md text-foreground">

                          {formatDate(
                            doc.expiryDate
                          )}
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
                            Approve {doc.label || doc.type}
                          </DialogTitle>
                          <DialogDescription>
                            Verification Notes
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 pt-2">
                          <MultiLangTabs
                            currentLang={currentLang}
                            onChange={setCurrentLang}
                          />
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

                            {/* Description (multilingual textarea, optional) */}
                            <MultiLangTextarea
                              label="Internal Note"
                              value={formData.internal.description}
                              currentLang={currentLang}
                              onChange={handleInternalChange}
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

                            {/* Description (multilingual textarea, optional) */}
                            <MultiLangTextarea
                              label="Description"
                              value={formData.tenant.description}
                              currentLang={currentLang}
                              onChange={handleTenantChange}
                            />
                          </div>

                          {/* ACTIONS */}
                          <div className="flex justify-end gap-3 pt-2">
                            <DialogClose asChild>
                              <Button variant="outline">
                                Cancel
                              </Button>
                            </DialogClose>

                            <Button
                              onClick={() => handleConfirmApprove(doc.documentId, kybData?.tenantId._id)}
                              disabled={loading}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {loading ? "Processing..." : "Confirm Approval"}
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
                            Reject {doc.label || doc.type}
                          </DialogTitle>

                          <DialogDescription>
                            Add rejection notes and compliance remarks.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 pt-2">

                          <MultiLangTabs
                            currentLang={currentLang}
                            onChange={setCurrentLang}
                          />
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
                            {/* Description (multilingual textarea, optional) */}
                            <MultiLangTextarea
                              label="Internal Note"
                              value={formData.internal.description}
                              currentLang={currentLang}
                              onChange={handleInternalChange}
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



                            {/* Description (multilingual textarea, optional) */}
                            <MultiLangTextarea
                              label="Description"
                              value={formData.tenant.description}
                              currentLang={currentLang}
                              onChange={handleTenantChange}
                            />
                          </div>

                          {/* ACTIONS */}
                          <div className="flex justify-end gap-3 pt-2">
                            <DialogClose asChild>
                              <Button variant="outline">
                                Cancel
                              </Button>
                            </DialogClose>

                            <Button
                              variant="destructive"
                              onClick={() => handleConfirmReject(doc.documentId, kybData?.tenantId?._id)}
                              disabled={loading}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              {loading ? "Processing..." : "Confirm Rejection"}
                            </Button>
                          </div>
                        </div>

                      </DialogContent>
                    </Dialog>

                  </div>
                </div>
              </div>

              {/* FILE GRID */}
              <div className="overflow-x-auto">
                <div className="p-3 flex items-start gap-3 min-w-max">
                  {doc.files?.map((file, fileIndex) => {
                    const fileUrl = file;
                    const fileName = file.split('/').pop() || `File-${fileIndex}`;

                    const extension =
                      fileName.split('.').pop()?.toLowerCase() || '';

                    const isImage = [
                      'png',
                      'jpg',
                      'jpeg',
                      'webp',
                      'gif',
                    ].includes(extension);

                    const isPDF = extension === 'pdf';
                    const isDOC = extension === 'doc' || extension === 'docx';

                    const isVideo = [
                      'mp4',
                      'mov',
                      'webm',
                    ].includes(extension);

                    return (
                      <div
                        key={fileIndex}
                        className="group w-[180px] shrink-0 rounded-xl border bg-background overflow-hidden"
                      >
                        <div className="aspect-square border-b bg-muted/20 relative overflow-hidden">

                          {/* IMAGE */}
                          {isImage && (
                            <img
                              src={fileUrl}
                              alt={fileName}
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

                          {/* Doc */}
                          {isDOC && (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-red-50 to-red-100">
                              <File className="w-10 h-10 text-red-500 mb-2" />

                              <div className="text-[11px] font-medium text-red-600">
                                DOC
                              </div>
                            </div>
                          )}

                          {/* VIDEO */}
                          {isVideo && (
                            <video
                              src={fileUrl}
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

                            {/* VIEW */}
                            {/* VIEW */}
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 bg-white text-black hover:bg-white/90"
                              onClick={() => {

                                const allFiles = doc.files || [];

                                setPreviewFiles(allFiles);

                                setActiveIndex(fileIndex);

                                setPreviewOpen(true);
                              }}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>

                            {/* DOWNLOAD */}
                            <Button
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                handleDownloadFile(
                                  fileUrl,
                                  fileName
                                )
                              }
                            >
                              <Download className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>

                        {/* FILE INFO */}
                        {/* <div className="p-3">
                        <div className="truncate text-sm font-medium text-foreground">
                          {fileName}
                        </div>

                        <div className="flex items-center justify-between mt-1 text-[14px] text-muted-foreground">
                          <span>{extension.toUpperCase()}</span>
                          <span>{doc.status}</span>
                        </div>
                      </div> */}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

        </CardContent>

      </Card>

      {/* Documets preview */}
      <Dialog
        open={previewOpen}
        onOpenChange={(open) => {
          setPreviewOpen(open);

          if (!open) {
            setZoom(1);

            setPosition({
              x: 0,
              y: 0,
            });

            setDragging(false);
          }
        }}
      >
        <DialogContent className="!max-w-none w-screen h-screen p-0 m-0 border-0 rounded-none bg-black overflow-hidden">

          <DialogTitle asChild>
            <VisuallyHidden>
              <span>File Preview</span>
            </VisuallyHidden>
          </DialogTitle>

          <div className="relative w-full h-full bg-black flex flex-col overflow-hidden">

            {/* HEADER */}
            <div className="h-16 border-b border-white/10 bg-black/80 backdrop-blur-xl flex items-center justify-between px-5 shrink-0 z-50">

              {/* LEFT */}
              <div className="flex items-center gap-4">

                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                  {previewFiles?.[activeIndex]
                    ?.toLowerCase()
                    ?.includes(".pdf") ? (
                    <FileText className="w-5 h-5 text-red-400" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-white" />
                  )}
                </div>

                <div>
                  <div className="text-sm font-medium text-white">
                    Preview File
                  </div>

                  <div className="text-xs text-zinc-400">
                    {activeIndex + 1} of {previewFiles.length}
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-2">

                {/* IMAGE CONTROLS ONLY */}
                {!previewFiles?.[activeIndex]
                  ?.toLowerCase()
                  ?.includes(".pdf") && (
                    <>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-white/10 border-white/10 hover:bg-white/20 text-white"
                        disabled={zoom <= 0.5}
                        onClick={() =>
                          setZoom((prev) =>
                            Math.max(prev - 0.25, 0.5)
                          )
                        }
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>

                      <div className="min-w-[70px] text-center text-sm text-white font-medium">
                        {Math.round(zoom * 100)}%
                      </div>

                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-white/10 border-white/10 hover:bg-white/20 text-white"
                        disabled={zoom >= 6}
                        onClick={() =>
                          setZoom((prev) =>
                            Math.min(prev + 0.25, 6)
                          )
                        }
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="secondary"
                        className="bg-white/10 border-white/10 hover:bg-white/20 text-white"
                        onClick={() => {
                          setZoom(1);

                          setPosition({
                            x: 0,
                            y: 0,
                          });
                        }}
                      >
                        Reset
                      </Button>
                    </>
                  )}

                {/* DOWNLOAD */}
                <Button
                  variant="secondary"
                  className="bg-white/10 border-white/10 hover:bg-white/20 text-white"
                  onClick={() =>
                    handleDownloadFile(
                      previewFiles[activeIndex]
                    )
                  }
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>

                {/* CLOSE */}
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => setPreviewOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* BODY */}
            <div className="relative flex-1 overflow-hidden bg-[#050505]">

              {/* LEFT NAV */}
              {activeIndex > 0 && (
                <button
                  onClick={() => {
                    setActiveIndex((prev) => prev - 1);

                    setZoom(1);

                    setPosition({
                      x: 0,
                      y: 0,
                    });
                  }}
                  className="absolute left-5 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 flex items-center justify-center transition"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
              )}

              {/* RIGHT NAV */}
              {activeIndex < previewFiles.length - 1 && (
                <button
                  onClick={() => {
                    setActiveIndex((prev) => prev + 1);

                    setZoom(1);

                    setPosition({
                      x: 0,
                      y: 0,
                    });
                  }}
                  className="absolute right-5 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 flex items-center justify-center transition"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              )}

              {/* PDF */}
              {previewFiles?.[activeIndex]
                ?.toLowerCase()
                ?.includes(".pdf") ? (
                <iframe
                  src={`${previewFiles[activeIndex]}#toolbar=0`}
                  className="w-full h-full bg-white"
                />
              ) : (
                /* IMAGE */
                <div
                  className={`w-full h-full overflow-auto ${zoom > 1
                    ? "cursor-grab active:cursor-grabbing"
                    : "cursor-default"
                    }`}
                >
                  <div
                    className="min-w-full min-h-full flex items-center justify-center p-10"
                    onMouseDown={(e) => {
                      if (zoom <= 1) return;

                      setDragging(true);

                      setDragStart({
                        x:
                          e.clientX +
                          e.currentTarget.scrollLeft,
                        y:
                          e.clientY +
                          e.currentTarget.scrollTop,
                      });
                    }}
                    onMouseMove={(e) => {
                      if (!dragging || zoom <= 1)
                        return;

                      const container =
                        e.currentTarget;

                      container.scrollLeft =
                        dragStart.x - e.clientX;

                      container.scrollTop =
                        dragStart.y - e.clientY;
                    }}
                    onMouseUp={() => setDragging(false)}
                    onMouseLeave={() =>
                      setDragging(false)
                    }
                  >
                    <img
                      src={previewFiles?.[activeIndex]}
                      draggable={false}
                      className="select-none object-contain transition-transform duration-150 ease-out shadow-2xl rounded-xl"
                      style={{
                        transform: `scale(${zoom})`,
                        transformOrigin:
                          "center center",
                        maxWidth: "unset",
                        maxHeight: "unset",
                        width:
                          zoom > 1
                            ? "auto"
                            : "80%",
                        height:
                          zoom > 1
                            ? "auto"
                            : "80%",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* THUMBNAILS */}
            {previewFiles.length > 1 && (
              <div className="h-28 border-t border-white/10 bg-black/40 backdrop-blur-xl overflow-x-auto shrink-0">

                <div className="flex items-center gap-3 px-5 py-3 min-w-max">

                  {previewFiles.map((file, index) => {
                    const isPDF =
                      file
                        ?.toLowerCase()
                        ?.includes(".pdf");

                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setActiveIndex(index);

                          setZoom(1);

                          setPosition({
                            x: 0,
                            y: 0,
                          });
                        }}
                        className={`relative w-24 h-20 rounded-xl overflow-hidden border transition-all duration-200 shrink-0 ${activeIndex === index
                          ? "border-primary ring-2 ring-primary/30 scale-105"
                          : "border-white/10 hover:border-white/30"
                          }`}
                      >
                        {isPDF ? (
                          <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center">
                            <FileText className="w-7 h-7 text-red-400" />

                            <span className="text-[10px] text-white mt-1">
                              PDF
                            </span>
                          </div>
                        ) : (
                          <img
                            src={file}
                            className="w-full h-full object-cover"
                          />
                        )}

                        {activeIndex === index && (
                          <div className="absolute inset-0 bg-primary/10 border border-primary rounded-xl" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>


    </div>
  );
}