'use client';

/* =========================================================
 * IMPORTS
 * =======================================================*/

import {
  useState,
  useRef,
  useEffect,
  useContext
} from 'react';

import Link from 'next/link';

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

import {
  createPlan
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
 * DROPDOWN COMPONENT
 * =======================================================*/

function Dropdown({
  options,
  value,
  onChange,
  placeholder
}: {
  options: {
    id: string;
    label: string;
  }[];

  value: string;

  onChange: (val: string) => void;

  placeholder?: string;
}) {

  /**
   * Dropdown open state
   */
  const [open, setOpen] =
    useState(false);

  /**
   * Dropdown wrapper reference
   */
  const ref =
    useRef<HTMLDivElement>(null);

  /* =====================================================
   * CLOSE DROPDOWN ON OUTSIDE CLICK
   * ===================================================*/

  useEffect(() => {

    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        ref.current &&
        !ref.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );

  }, []);

  return (
    <div
      className="relative"
      ref={ref}
    >

      {/* =============================================
          DROPDOWN BUTTON
      ============================================== */}

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
            (o) => o.id === value
          )?.label ||
          placeholder ||
          'Select'
        }

        <ChevronDown className="w-4 h-4" />
      </button>

      {/* =============================================
          DROPDOWN MENU
      ============================================== */}

      {open && (
        <div
          className="
            absolute z-10 mt-1 w-full
            bg-white border rounded-md
            shadow-lg max-h-48 overflow-y-auto
          "
        >
          {options.map((opt) => (
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
const CURRENCIES = [
  'USD',
  'EUR'
];

/**
 * Subscription duration types
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
 * Multi-language object
 *
 * Example:
 * {
 *   en: "Hello",
 *   fr: "Bonjour"
 * }
 */
type MultiLangText =
  Record<Language, string>;

/**
 * Plan form structure
 */
interface PlanForm {
  name: MultiLangText;
  description: MultiLangText;
  price: string;
  currency: string;
  type: string;
  status: string;
}

/* =========================================================
 * HELPERS
 * =======================================================*/

/**
 * Create empty language object
 */
const createEmptyLangObject =
  (): MultiLangText =>
    Object.fromEntries(
      Object.keys(LANGUAGES).map(
        (lang) => [lang, '']
      )
    ) as MultiLangText;

/* =========================================================
 * PAGE COMPONENT
 * =======================================================*/

export default function AddPlanPage() {

  /* =====================================================
   * CONTEXTS
   * ===================================================*/

  const { locale } =
    useContext(I18nContext);

  const { t } = useAdmin();

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

      type: 'MONTHLY',

      status: 'INACTIVE'
    });

  /**
   * Active language tab
   */
  const [currentLang, setCurrentLang] =
    useState<Language>(locale);

  /**
   * Validation errors
   */
  const [errors, setErrors] =
    useState<
      Record<string, string>
    >({});

  /**
   * Loading state
   */
  const [isLoading, setIsLoading] =
    useState(false);

  /**
   * Global message handler
   */
  const {
    message,
    type,
    visible,
    showMessage,
    clearMessage
  } = useAppMessage();

  /* =====================================================
   * INPUT CHANGE HANDLER
   * ===================================================*/

  const handleInputChange = (
    field:
      | 'name'
      | 'description'
      | 'price'
      | 'currency'
      | 'type'
      | 'status',

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

    } else {

      /**
       * Handle normal fields
       */
      setFormData((prev) => ({
        ...prev,
        [field]: value
      }));
    }

    /**
     * Clear field error
     */
    setErrors((prev) => ({
      ...prev,
      [field]: ''
    }));
  };

  /* =====================================================
   * FORM VALIDATION
   * ===================================================*/

  const validateForm = () => {

    const newErrors:
      Record<string, string> = {};

    /**
     * Default language name required
     */
    if (
      !formData.name[
        DEFAULT_LANGUAGE
      ].trim()
    ) {
      newErrors.name =
        `Name (${DEFAULT_LANGUAGE.toUpperCase()}) is required`;
    }

    /**
     * Price validation
     */
    if (
      !formData.price ||
      Number(formData.price) <= 0
    ) {
      newErrors.price =
        'Price must be greater than 0';
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  /* =====================================================
   * CREATE PLAN
   * ===================================================*/

  const handleSave = async () => {

    /**
     * Stop if validation fails
     */
    if (!validateForm()) return;

    setIsLoading(true);

    /**
     * Clear global errors
     */
    setErrors((prev) => ({
      ...prev,
      global: ''
    }));

    try {

      /* ===============================================
       * CREATE PLAN API
       * =============================================*/

      const res = await createPlan({
        name: formData.name,

        description:
          formData.description,

        price: Number(formData.price),

        currency:
          formData.currency,

        duration:
          formData.type as
          | 'MONTHLY'
          | 'YEARLY',

        modules: []
      });

      const isSuccess =
        res?.status === 201;

      /* ===============================================
       * SUCCESS
       * =============================================*/

      if (isSuccess) {

        showMessage(
          res?.message ||
          'Plan created successfully',
          'success'
        );

        /**
         * Reset form
         */
        setFormData({
          name:
            createEmptyLangObject(),

          description:
            createEmptyLangObject(),

          price: '',

          currency: 'USD',

          type: 'MONTHLY',

          status: 'INACTIVE'
        });

        return;
      }

      /* ===============================================
       * FAILURE
       * =============================================*/

      showMessage(
        res?.message ||
        'Failed to create plan',
        'danger'
      );

    } catch (err) {

      console.error(
        'Create plan error:',
        err
      );

      showMessage(
        'Something went wrong while creating the plan',
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
          <h1
            className="
            text-xl font-medium
            text-foreground
          "
          >
            {t(
              'translate.plans_create_title'
            )}
          </h1>

          <p
            className="
            text-sm text-muted-foreground
          "
          >
            {t(
              'translate.plans_create_subtitle'
            )}
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
            {t(
              'translate.plans_details'
            )}
          </CardTitle>

          <CardDescription>
            {t(
              'translate.plans_details_description'
            )}
          </CardDescription>

        </CardHeader>

        {/* Card body */}
        <CardContent className="space-y-4">

          {/* =============================================
            GLOBAL ERROR
        ============================================== */}

          {errors.global && (
            <div
              className="
              p-3 rounded-md
              bg-red-100 text-red-700
              border border-red-300
            "
            >
              {errors.global}
            </div>
          )}

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
            label={t(
              'translate.plans_name'
            )}
            value={formData.name}
            currentLang={currentLang}
            onChange={(lang, value) =>
              handleInputChange(
                'name',
                value,
                lang
              )
            }
            error={errors.name}
          />

          {/* =============================================
            DESCRIPTION
        ============================================== */}

          <MultiLangTextarea
            label={t(
              'translate.description'
            )}
            value={formData.description}
            currentLang={currentLang}
            onChange={(lang, value) =>
              handleInputChange(
                'description',
                value,
                lang
              )
            }
            rows={3}
          />

          {/* =============================================
            CURRENCY + PRICE
        ============================================== */}

          <div className="flex gap-2">

            {/* Currency */}
            <div className="flex-1">

              <Label className="mb-2 block">
                {t(
                  'translate.currency'
                )}
              </Label>

              <Dropdown
                options={CURRENCIES.map(
                  (c) => ({
                    id: c,
                    label: c
                  })
                )}
                value={formData.currency}
                onChange={(val) =>
                  handleInputChange(
                    'currency',
                    val
                  )
                }
              />
            </div>

            {/* Price */}
            <div className="flex-1">

              <Label className="mb-2 block">
                {t(
                  'translate.price'
                )}
              </Label>

              <Input
                type="number"
                min={0}
                value={formData.price}
                onChange={(e) =>
                  handleInputChange(
                    'price',
                    e.target.value
                  )
                }
                placeholder="0.00"
              />

              {errors.price && (
                <p
                  className="
                  text-red-500 text-sm
                "
                >
                  {errors.price}
                </p>
              )}
            </div>
          </div>

          {/* =============================================
            PLAN TYPE + STATUS
        ============================================== */}

          <div className="flex gap-2">

            {/* Duration */}
            <div className="flex-1">

              <Label className="mb-2 block">
                {t(
                  'translate.plan_type'
                )}
              </Label>

              <Dropdown
                options={PLAN_TYPES.map(
                  (type) => ({
                    ...type,
                    label: t(
                      `translate.plans_interval_${type.id.toLowerCase()}`
                    )
                  })
                )}
                value={formData.type}
                onChange={(val) =>
                  handleInputChange(
                    'type',
                    val
                  )
                }
              />
            </div>

            {/* Status */}
            <div className="flex-1">

              <Label className="mb-2 block">
                {t(
                  'translate.status'
                )}
              </Label>

              <Dropdown
                options={STATUS_TYPES.map(
                  (status) => ({
                    ...status,
                    label: t(
                      `translate.plans_${status.id.toLowerCase()}`
                    )
                  })
                )}
                value={formData.status}
                onChange={(val) =>
                  handleInputChange(
                    'status',
                    val
                  )
                }
              />
            </div>
          </div>

          {/* =============================================
            ACTION BUTTONS
        ============================================== */}

          <div className="flex gap-3 mt-4">

            {/* Save */}
            <Button
              onClick={handleSave}
              className="
              gap-2 bg-primary flex-1
            "
              disabled={isLoading}
            >
              <Save className="w-4 h-4" />

              {isLoading
                ? t(
                  'translate.saving'
                )
                : t(
                  'translate.plans_save'
                )}
            </Button>

            {/* Cancel */}
            <Link
              href="/root/plans"
              className="flex-1"
            >
              <Button
                variant="outline"
                className="w-full"
              >
                {t(
                  'translate.cancel'
                )}
              </Button>
            </Link>
          </div>

        </CardContent>
      </Card>

      {/* =================================================
        GLOBAL APP MESSAGE
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