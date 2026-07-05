import type { Region } from './regions';

// Options offered in the "Select your Country" enrollment modal.
// These map 1:1 to the backend's pricing Regions (server/prisma/schema.prisma `Region` enum).
// `code` is the ISO-2 (lowercase) code react-phone-input-2 expects for its `country` prop —
// for the non-country groupings (Europe, Others) a representative code is used.
// `region` is the exact backend Region enum key — used to filter a course's already-fetched
// `packages` client-side (e.g. on the course listing cards) without an extra network call.
// `name` is sent to the backend as-is; server/src/common/utils/region.util.ts maps it to a
// pricing Region ("Others" isn't a recognized key there, so it correctly falls back
// to Region.OTHERS/USD).

export interface CountryOption {
  name: string;
  code: string;
  region: Region;
}

export const LOCAL_COUNTRY: CountryOption = { name: 'Pakistan', code: 'pk', region: 'PAKISTAN' };

export const COUNTRIES: CountryOption[] = [
  LOCAL_COUNTRY,
  { name: 'Australia', code: 'au', region: 'AUSTRALIA' },
  { name: 'Canada', code: 'ca', region: 'CANADA' },
  { name: 'Europe', code: 'de', region: 'EUROPE' },
  { name: 'Saudi Arabia', code: 'sa', region: 'KSA' },
  { name: 'Kuwait', code: 'kw', region: 'KUWAIT' },
  { name: 'Qatar', code: 'qa', region: 'QATAR' },
  { name: 'UAE', code: 'ae', region: 'UAE' },
  { name: 'United Kingdom', code: 'gb', region: 'UK' },
  { name: 'United States', code: 'us', region: 'US' },
  { name: 'Others', code: 'us', region: 'OTHERS' },
];
