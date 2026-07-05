// Countries offered in the "Select your Country" enrollment modal.
// `code` is the ISO-2 (lowercase) code react-phone-input-2 expects for its `country` prop.
// `name` is sent to the backend as-is; server/src/common/utils/region.util.ts maps it to a
// pricing Region (falls back to OTHERS/USD for anything not explicitly listed there).

export interface CountryOption {
  name: string;
  code: string;
}

export const LOCAL_COUNTRY: CountryOption = { name: 'Pakistan', code: 'pk' };

export const COUNTRIES: CountryOption[] = [
  LOCAL_COUNTRY,
  { name: 'United States', code: 'us' },
  { name: 'United Kingdom', code: 'gb' },
  { name: 'United Arab Emirates', code: 'ae' },
  { name: 'Qatar', code: 'qa' },
  { name: 'Saudi Arabia', code: 'sa' },
  { name: 'Kuwait', code: 'kw' },
  { name: 'Australia', code: 'au' },
  { name: 'Canada', code: 'ca' },
  { name: 'Germany', code: 'de' },
  { name: 'France', code: 'fr' },
  { name: 'Italy', code: 'it' },
  { name: 'Spain', code: 'es' },
  { name: 'Netherlands', code: 'nl' },
  { name: 'Ireland', code: 'ie' },
  { name: 'Sweden', code: 'se' },
  { name: 'Norway', code: 'no' },
];

// Shown at the end of the picker for anyone whose country isn't listed above.
// Sent to the backend as an empty-ish label so it resolves to Region.OTHERS.
export const OTHER_COUNTRY: CountryOption = { name: 'Other', code: 'us' };
