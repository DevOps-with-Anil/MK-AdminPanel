// utils/getConsistentBadgeColor.ts

const badgeColorPalette = [
  'bg-blue-200 text-blue-700',
  'bg-purple-200 text-purple-700',
  'bg-orange-200 text-orange-700',
  'bg-pink-200 text-pink-700',
  'bg-cyan-200 text-cyan-700',
  'bg-indigo-200 text-indigo-700',
  'bg-red-200 text-red-700',
  'bg-emerald-200 text-emerald-700',
  'bg-teal-200 text-teal-700',
  'bg-violet-200 text-violet-700',
  'bg-amber-200 text-amber-700',
  'bg-lime-200 text-lime-700',
  'bg-rose-200 text-rose-700',
  'bg-sky-200 text-sky-700',
];

const colorMap = new Map<string, string>();

/* ================= FIXED COLORS ================= */

const FIXED_STATUS_COLORS: Record<
  string,
  string
> = {
  // PRIMARY / SUCCESS
  ACTIVE:
    'bg-primary text-primary-foreground',
  VERIFIED:
    'bg-primary text-primary-foreground',
  VERIFY:
    'bg-primary text-primary-foreground',
  APPROVED:
    'bg-primary text-primary-foreground',
  SUCCESS:
    'bg-primary text-primary-foreground',
  TRUE:
    'bg-primary text-primary-foreground',
  INACTIVE:
    'bg-gray-500 text-white',
  FALSE:
    'bg-gray-500 text-white',
  DISABLED:
    'bg-gray-500 text-white',
  CLOSED:
    'bg-gray-500 text-white',
  PENDING:
    'bg-yellow-200 text-yellow-700',
  UPLOADED:
    'bg-blue-200 text-blue-700',
  WAITING:
    'bg-yellow-200 text-yellow-700',
  INREVIEW:
    'bg-yellow-200 text-yellow-700',
  PROCESSING:
    'bg-yellow-200 text-yellow-700',
  REJECTED:
    'bg-red-200 text-red-700',
  HIGH :
    'bg-red-200 text-red-700',
  MEDIUM:
    'bg-blue-200 text-blue-700',
  LOW:
    'bg-green-200 text-green-700',
  RESOLVED :
    'bg-green-200 text-green-700',
  FAILED:
    'bg-red-200 text-red-700',
  BLOCKED:
    'bg-red-200 text-red-700',
  SUSPENDED:
    'bg-red-200 text-red-700',
};

/* ================= MAIN FUNCTION ================= */

export const getConsistentBadgeColor = (
  value?: string
) => {
  if (!value) {
    return 'bg-gray-100 text-gray-700';
  }

  const normalized =
    value.trim().toUpperCase();

  // fixed status colors
  if (
    FIXED_STATUS_COLORS[
    normalized
    ]
  ) {
    return FIXED_STATUS_COLORS[
      normalized
    ];
  }

  // already assigned
  if (colorMap.has(normalized)) {
    return colorMap.get(normalized)!;
  }

  // assign dynamic color
  const assignedColor =
    badgeColorPalette[
    colorMap.size %
    badgeColorPalette.length
    ];

  colorMap.set(
    normalized,
    assignedColor
  );

  return assignedColor;
};