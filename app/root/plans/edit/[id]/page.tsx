// 'use client';

// import { useState, useRef, useEffect, useContext } from 'react';
// import { useParams } from 'next/navigation';
// import { useAdmin } from '@/contexts/AdminContext';
// import {
//   Card, CardContent, CardHeader, CardTitle, CardDescription
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { ArrowLeft, Save, ChevronDown } from 'lucide-react';
// import Link from 'next/link';

// import { updatePlan, getPlantoEdit } from '@/services/auth.service';

// import { I18nContext } from '@/i18n/provider';
// import { LANGUAGES, DEFAULT_LANGUAGE, Language } from '@/i18n/languages';

// import { MultiLangTabs } from '@/components/common/MultiLangTabs';
// import { MultiLangInput } from '@/components/common/MultiLangInput';
// import { MultiLangTextarea } from '@/components/common/MultiLangTextarea';


// import { AppMessage } from '@/components/common/AppMessage';
// import { useAppMessage } from '@/hooks/ui/useAppMessage';

// // ---------------------- Dropdown ----------------------
// function Dropdown({ options, value, onChange }: any) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   return (
//     <div ref={ref} className="relative">
//       <button
//         type="button"
//         onClick={() => setOpen(!open)}
//         className="w-full px-3 py-2 border rounded-md flex justify-between items-center bg-white"
//       >
//         {options.find((o: any) => o.id === value)?.label || 'Select'}
//         <ChevronDown className="w-4 h-4" />
//       </button>

//       {open && (
//         <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
//           {options.map((opt: any) => (
//             <div
//               key={opt.id}
//               onClick={() => {
//                 onChange(opt.id);
//                 setOpen(false);
//               }}
//               className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//             >
//               {opt.label}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ---------------------- Constants ----------------------
// const CURRENCIES = ['USD', 'EUR'];

// const PLAN_TYPES = [
//   { id: 'MONTHLY', label: 'Monthly' },
//   { id: 'YEARLY', label: 'Yearly' }
// ];

// const STATUS_TYPES = [
//   { id: 'INACTIVE', label: 'Inactive' },
//   { id: 'ACTIVE', label: 'Active' }
// ];

// // ---------------------- Types ----------------------
// type MultiLangText = Record<Language, string>;

// interface PlanForm {
//   name: MultiLangText;
//   description: MultiLangText;
//   price: string;
//   currency: string;
//   duration: string;
//   status: string;
// }

// // ---------------------- Helpers ----------------------
// const createEmptyLangObject = (): MultiLangText =>
//   Object.fromEntries(Object.keys(LANGUAGES).map(l => [l, ''])) as MultiLangText;

// // ✅ FIXED NORMALIZER
// const normalizeMultiLang = (value: any): MultiLangText => {
//   if (typeof value === 'object' && value !== null) {
//     return {
//       ...createEmptyLangObject(),
//       ...value
//     };
//   }

//   return {
//     ...createEmptyLangObject(),
//     [DEFAULT_LANGUAGE]: value || ''
//   };
// };

// // ---------------------- Component ----------------------
// export default function PlanFormPage() {
//   const { locale } = useContext(I18nContext);
//   const { t } = useAdmin();

//   const params = useParams();
//   const planId = params?.id as string;
//   const isEditMode = !!planId;

//   const [formData, setFormData] = useState<PlanForm>({
//     name: createEmptyLangObject(),
//     description: createEmptyLangObject(),
//     price: '',
//     currency: 'USD',
//     duration: 'MONTHLY',
//     status: 'INACTIVE',
//   });

//   const [currentLang, setCurrentLang] = useState<Language>(locale);
//   const [errors, setErrors] = useState<any>({});
//   const [isLoading, setIsLoading] = useState(false);

//   const { message, type, visible, showMessage, clearMessage } = useAppMessage();

//   // ---------------------- Load Plan ----------------------
//   useEffect(() => {
//     if (!planId) return;

//     const fetchPlan = async () => {
//       try {
//         setIsLoading(true);

//         const res = await getPlantoEdit(planId);
//         const plan = res.data;

//         setFormData({
//           name: normalizeMultiLang(plan.name),
//           description: normalizeMultiLang(plan.description),
//           price: String(plan.price || ''),
//           currency: plan.currency || 'USD',
//           duration: plan.duration || 'MONTHLY',
//           status: plan.status || 'INACTIVE',
//         });

//       } catch {
//         setErrors({ global: 'Failed to load plan' });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPlan();
//   }, [planId]);

//   // ---------------------- Handlers ----------------------
//   const handleInputChange = (field: keyof PlanForm, value: string, lang?: Language) => {
//     if (lang && (field === 'name' || field === 'description')) {
//       setFormData(prev => ({
//         ...prev,
//         [field]: { ...prev[field], [lang]: value }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [field]: value }));
//     }
//   };

//   const validateForm = () => {
//     const e: any = {};

//     if (!formData.name[DEFAULT_LANGUAGE]) {
//       e.name = 'Name required';
//     }

//     if (!formData.price || Number(formData.price) <= 0) {
//       e.price = 'Invalid price';
//     }

//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   // ---------------------- Save ----------------------
//   const handleSave = async () => {
//     if (!validateForm()) return;

//     setIsLoading(true);



//     try {
//       /* ================= UPDATE PLAN ================= */

//       const res = await updatePlan(
//         planId as string,
//         formData
//       );

//       const isSuccess = res?.status === 201;

//       /* ================= SUCCESS ================= */

//       if (isSuccess) {
//         showMessage(
//           res?.message || "Plan updated successfully",
//           "success"
//         );

//         return;
//       }
//       /* ================= FAILURE ================= */
//       showMessage(
//         res?.message || "Failed to update plan",
//         "danger"
//       );

//     } catch (err: any) {
//       console.error("Update plan error:", err);

//       showMessage(
//         err?.message ||
//         "Something went wrong while updating the plan",
//         "danger"
//       );


//     } finally {
//       setIsLoading(false);
//     }
//   };
//   // ---------------------- UI ----------------------
//   return (
//     <div className="space-y-6 max-w-xl">

//       <div className="flex items-center gap-4">
//         <Link href="/root/plans">
//           <Button variant="ghost" size="sm">
//             <ArrowLeft className="w-4 h-4" />
//           </Button>
//         </Link>

//         <div>
//           <h1 className="text-xl font-medium">Edit Plan</h1>
//           <p className="text-sm text-muted-foreground">Update your plan</p>
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Plan Details</CardTitle>
//           <CardDescription>
//             Fill plan information in multiple languages
//           </CardDescription>
//           {/* <CardTitle>
//     {t('ranslate.plans_edit_title')}
//   </CardTitle>
//   <CardDescription>
//     {t('translate.plans_details_subtitle')}
//   </CardDescription> */}
//         </CardHeader>

//         <CardContent className="space-y-4">
//           <MultiLangTabs currentLang={currentLang} onChange={setCurrentLang} />
//           <MultiLangInput
//             label="Plan Name"
//             value={formData.name}
//             currentLang={currentLang}
//             onChange={(l, v) => handleInputChange('name', v, l)}
//             error={errors.name}
//           />

//           <MultiLangTextarea
//             label="Description"
//             value={formData.description}
//             currentLang={currentLang}
//             onChange={(l, v) => handleInputChange('description', v, l)}
//           />

//           <div className="flex gap-2">
//             <div className="flex-1">
//               <Label className="mb-2 block">Currency</Label>
//               <Dropdown
//                 options={CURRENCIES.map(c => ({ id: c, label: c }))}
//                 value={formData.currency}
//                 onChange={(v: string) => handleInputChange('currency', v)}
//               />
//             </div>

//             <div className="flex-1">
//               <Label className="mb-2 block">Price</Label>
//               <Input
//                 type="number"
//                 value={formData.price}
//                 onChange={e => handleInputChange('price', e.target.value)}
//               />
//             </div>
//           </div>


//           <div className="flex gap-2">
//             <div className="flex-1">
//               <Label className="mb-2 block">Plan Type</Label>
//               <Dropdown
//                 options={PLAN_TYPES}
//                 value={formData.duration}
//                 onChange={(v: string) => handleInputChange('duration', v)}
//               />
//             </div>

//             <div className="flex-1">
//               <Label className="mb-2 block">Status</Label>
//               <Dropdown
//                 options={STATUS_TYPES}
//                 value={formData.status}
//                 onChange={(v: string) => handleInputChange('status', v)}
//               />
//             </div>
//           </div>

//           <Button onClick={handleSave} disabled={isLoading} className="w-full">
//             <Save className="w-4 h-4 mr-2" />
//             {isLoading ? 'Saving...' : 'Update Plan'}
//           </Button>

//         </CardContent>
//       </Card>

//       <AppMessage
//         visible={visible}
//         message={message}
//         type={type}
//         onClose={clearMessage}
//       />
//     </div>
//   );
// }


'use client';

/* =========================================================
 * IMPORTS
 * =======================================================*/

import { useState, useRef, useEffect, useContext } from 'react';
import { useParams } from 'next/navigation';

import { useAdmin } from '@/contexts/AdminContext';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  ArrowLeft,
  Save,
  ChevronDown
} from 'lucide-react';

import Link from 'next/link';

import {
  updatePlan,
  getPlantoEdit
} from '@/services/auth.service';

import { I18nContext } from '@/i18n/provider';

import {
  LANGUAGES,
  DEFAULT_LANGUAGE,
  Language
} from '@/i18n/languages';

import { MultiLangTabs } from '@/components/common/MultiLangTabs';
import { MultiLangInput } from '@/components/common/MultiLangInput';
import { MultiLangTextarea } from '@/components/common/MultiLangTextarea';

import { AppMessage } from '@/components/common/AppMessage';
import { useAppMessage } from '@/hooks/ui/useAppMessage';

/* =========================================================
 * CUSTOM DROPDOWN COMPONENT
 * =======================================================*/

function Dropdown({
  options,
  value,
  onChange
}: any) {
  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  /**
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handler
    );

    return () =>
      document.removeEventListener(
        'mousedown',
        handler
      );
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Dropdown trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          w-full px-3 py-2 border rounded-md
          flex justify-between items-center
          bg-white
        "
      >
        {
          options.find(
            (o: any) => o.id === value
          )?.label || 'Select'
        }

        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          className="
            absolute z-10 mt-1 w-full
            bg-white border rounded-md shadow-lg
            max-h-48 overflow-y-auto
          "
        >
          {options.map((opt: any) => (
            <div
              key={opt.id}
              onClick={() => {
                onChange(opt.id);
                setOpen(false);
              }}
              className="
                px-3 py-2 hover:bg-gray-100
                cursor-pointer
              "
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
 * CONSTANTS
 * =======================================================*/

/**
 * Supported currencies
 */
const CURRENCIES = ['USD', 'EUR'];

/**
 * Subscription durations
 */
const PLAN_TYPES = [
  {
    id: 'MONTHLY',
    label: 'Monthly'
  },
  {
    id: 'YEARLY',
    label: 'Yearly'
  }
];

/**
 * Plan statuses
 */
const STATUS_TYPES = [
  {
    id: 'INACTIVE',
    label: 'Inactive'
  },
  {
    id: 'ACTIVE',
    label: 'Active'
  }
];

/* =========================================================
 * TYPES
 * =======================================================*/

/**
 * Multi-language text object
 * Example:
 * {
 *   en: "Hello",
 *   fr: "Bonjour"
 * }
 */
type MultiLangText = Record<
  Language,
  string
>;

/**
 * Plan form structure
 */
interface PlanForm {
  name: MultiLangText;
  description: MultiLangText;
  price: string;
  currency: string;
  duration: string;
  status: string;
}

/* =========================================================
 * HELPERS
 * =======================================================*/

/**
 * Create empty multilingual object
 */
const createEmptyLangObject =
  (): MultiLangText =>
    Object.fromEntries(
      Object.keys(LANGUAGES).map((l) => [
        l,
        ''
      ])
    ) as MultiLangText;

/**
 * Normalize multilingual data
 *
 * Handles:
 * - Existing language objects
 * - Plain strings from API
 */
const normalizeMultiLang = (
  value: any
): MultiLangText => {
  if (
    typeof value === 'object' &&
    value !== null
  ) {
    return {
      ...createEmptyLangObject(),
      ...value
    };
  }

  return {
    ...createEmptyLangObject(),
    [DEFAULT_LANGUAGE]:
      value || ''
  };
};

/* =========================================================
 * PAGE COMPONENT
 * =======================================================*/

export default function PlanFormPage() {

  /* =====================================================
   * CONTEXTS
   * ===================================================*/

  const { locale } =
    useContext(I18nContext);

  const { t } = useAdmin();

  /* =====================================================
   * ROUTE PARAMS
   * ===================================================*/

  const params = useParams();

  const planId = params?.id as string;

  /**
   * Determine edit mode
   */
  const isEditMode = !!planId;

  /* =====================================================
   * STATE
   * ===================================================*/

  /**
   * Main form state
   */
  const [formData, setFormData] =
    useState<PlanForm>({
      name: createEmptyLangObject(),
      description:
        createEmptyLangObject(),
      price: '',
      currency: 'USD',
      duration: 'MONTHLY',
      status: 'INACTIVE'
    });

  /**
   * Current selected language tab
   */
  const [currentLang, setCurrentLang] =
    useState<Language>(locale);

  /**
   * Validation errors
   */
  const [errors, setErrors] =
    useState<any>({});

  /**
   * Loader state
   */
  const [isLoading, setIsLoading] =
    useState(false);

  /**
   * Global app message hook
   */
  const {
    message,
    type,
    visible,
    showMessage,
    clearMessage
  } = useAppMessage();

  /* =====================================================
   * LOAD PLAN DETAILS
   * ===================================================*/

  useEffect(() => {
    if (!planId) return;

    /**
     * Fetch plan by ID
     */
    const fetchPlan = async () => {
      try {
        setIsLoading(true);

        const res =
          await getPlantoEdit(planId);

        const plan = res.data;

        /**
         * Populate form
         */
        setFormData({
          name: normalizeMultiLang(
            plan.name
          ),

          description:
            normalizeMultiLang(
              plan.description
            ),

          price: String(
            plan.price || ''
          ),

          currency:
            plan.currency || 'USD',

          duration:
            plan.duration || 'MONTHLY',

          status:
            plan.status || 'INACTIVE'
        });

      } catch {
        setErrors({
          global:
            'Failed to load plan'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();

  }, [planId]);

  /* =====================================================
   * FORM INPUT HANDLER
   * ===================================================*/

  const handleInputChange = (
    field: keyof PlanForm,
    value: string,
    lang?: Language
  ) => {

    /**
     * Handle multilingual fields
     */
    if (
      lang &&
      (
        field === 'name' ||
        field === 'description'
      )
    ) {
      setFormData((prev) => ({
        ...prev,

        [field]: {
          ...prev[field],
          [lang]: value
        }
      }));

      return;
    }

    /**
     * Handle normal fields
     */
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  /* =====================================================
   * FORM VALIDATION
   * ===================================================*/

  const validateForm = () => {
    const e: any = {};

    /**
     * Name required
     */
    if (
      !formData.name[
      DEFAULT_LANGUAGE
      ]
    ) {
      e.name = 'Name required';
    }

    /**
     * Price validation
     */
    if (
      !formData.price ||
      Number(formData.price) <= 0
    ) {
      e.price = 'Invalid price';
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  /* =====================================================
   * SAVE / UPDATE PLAN
   * ===================================================*/

  const handleSave = async () => {

    /**
     * Stop if validation fails
     */
    if (!validateForm()) return;

    setIsLoading(true);

    try {

      /* ===============================================
       * UPDATE PLAN API
       * =============================================*/

      const res = await updatePlan(
        planId,
        formData
      );

      const isSuccess =
        res?.status === 201;

      /* ===============================================
       * SUCCESS
       * =============================================*/

      if (isSuccess) {
        showMessage(
          res?.message ||
          'Plan updated successfully',
          'success'
        );

        return;
      }

      /* ===============================================
       * FAILURE
       * =============================================*/

      showMessage(
        res?.message ||
        'Failed to update plan',
        'danger'
      );

    } catch (err: any) {

      console.error(
        'Update plan error:',
        err
      );

      showMessage(
        err?.message ||
        'Something went wrong while updating the plan',
        'danger'
      );

    } finally {
      setIsLoading(false);
    }
  };

  /* =====================================================
   * UI
   * ===================================================*/

  return (
    <div className="space-y-6 max-w-xl">

      {/* =================================================
          PAGE HEADER
      ================================================== */}

      <div className="flex items-center gap-4">

        {/* Back button */}
        <Link href="/root/plans">
          <Button
            variant="ghost"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>

        {/* Title */}
        <div>
          <h1 className="text-xl font-medium">
            Edit Plan
          </h1>

          <p className="text-sm text-muted-foreground">
            Update your plan
          </p>
        </div>
      </div>

      {/* =================================================
          FORM CARD
      ================================================== */}

      <Card>

        {/* Card header */}
        <CardHeader>

          <CardTitle>
            Plan Details
          </CardTitle>

          <CardDescription>
            Fill plan information in
            multiple languages
          </CardDescription>

        </CardHeader>

        {/* Card body */}
        <CardContent className="space-y-4">

          {/* =============================================
              LANGUAGE TABS
          ============================================== */}

          <MultiLangTabs
            currentLang={currentLang}
            onChange={setCurrentLang}
          />

          {/* =============================================
              PLAN NAME
          ============================================== */}

          <MultiLangInput
            label="Plan Name"
            value={formData.name}
            currentLang={currentLang}
            onChange={(l, v) =>
              handleInputChange(
                'name',
                v,
                l
              )
            }
            error={errors.name}
          />

          {/* =============================================
              DESCRIPTION
          ============================================== */}

          <MultiLangTextarea
            label="Description"
            value={formData.description}
            currentLang={currentLang}
            onChange={(l, v) =>
              handleInputChange(
                'description',
                v,
                l
              )
            }
          />

          {/* =============================================
              CURRENCY + PRICE
          ============================================== */}

          <div className="flex gap-2">

            {/* Currency */}
            <div className="flex-1">

              <Label className="mb-2 block">
                Currency
              </Label>

              <Dropdown
                options={CURRENCIES.map(
                  (c) => ({
                    id: c,
                    label: c
                  })
                )}
                value={formData.currency}
                onChange={(v: string) =>
                  handleInputChange(
                    'currency',
                    v
                  )
                }
              />
            </div>

            {/* Price */}
            <div className="flex-1">

              <Label className="mb-2 block">
                Price
              </Label>

              <Input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  handleInputChange(
                    'price',
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          {/* =============================================
              PLAN TYPE + STATUS
          ============================================== */}

          <div className="flex gap-2">

            {/* Duration */}
            <div className="flex-1">

              <Label className="mb-2 block">
                Plan Type
              </Label>

              <Dropdown
                options={PLAN_TYPES}
                value={formData.duration}
                onChange={(v: string) =>
                  handleInputChange(
                    'duration',
                    v
                  )
                }
              />
            </div>

            {/* Status */}
            <div className="flex-1">

              <Label className="mb-2 block">
                Status
              </Label>

              <Dropdown
                options={STATUS_TYPES}
                value={formData.status}
                onChange={(v: string) =>
                  handleInputChange(
                    'status',
                    v
                  )
                }
              />
            </div>
          </div>

          {/* =============================================
              SUBMIT BUTTON
          ============================================== */}

          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />

            {isLoading
              ? 'Saving...'
              : 'Update Plan'}
          </Button>

        </CardContent>
      </Card>

      {/* =================================================
          GLOBAL MESSAGE
      ================================================== */}

      <AppMessage
        visible={visible}
        message={message}
        type={type}
        onClose={clearMessage}
      />
    </div>
  );
}