// ✅ Types
export type Option = {
  value: string;
  label: string;
};

export type PhoneOption = {
  code: string;
  label: string;
};

// ✅ Phone Codes
export const PHONE_CODES: PhoneOption[] = [
  { code: '+1', label: 'USA (+1)' },
  { code: '+33', label: 'France (+33)' }
];

// ✅ Nested Location Data
export const LOCATION = {
  India: {
    states: {
      "Madhya Pradesh": ["Bhopal", "Indore"],
      Maharashtra: ["Mumbai"],
      Delhi: ["New Delhi"],
    },
  },
  USA: {
    states: {
      California: ["Los Angeles", "San Francisco"],
      Texas: ["Houston", "Dallas"],
    },
  },
  UK: {
    states: {
      England: ["London", "Manchester"],
    },
  },
  Australia: {
    states: {
      "New South Wales": ["Sydney"],
    },
  },
  UAE: {
    states: {
      Dubai: ["Dubai"],
    },
  },
  Canada: {
    states: {
      Ontario: ["Toronto"],
    },
  },
  Germany: {
    states: {
      Bavaria: ["Munich"],
    },
  },
} as const;

// ✅ Internal Types
type LocationType = typeof LOCATION;

// ✅ Helpers

export const getCountries = (): Option[] => {
  return Object.keys(LOCATION).map((c) => ({
    value: c,
    label: c,
  }));
};

export const getStates = (country: string): Option[] => {
  if (!country || !(country in LOCATION)) {
    return [] as Option[]; // ✅ force type
  }

  return Object.keys(LOCATION[country as keyof typeof LOCATION].states).map(
    (s) => ({
      value: s,
      label: s,
    })
  );
};

export const getCities = (country: string, state: string): Option[] => {
  if (!country || !state) return [];

  const countryData = LOCATION[country as keyof typeof LOCATION];
  if (!countryData) return [];

  const states = countryData.states;
  const cities = states[state as keyof typeof states];

  if (!cities) return [];

  return (cities as readonly string[]).map((city) => ({
    value: city,
    label: city,
  }));
};