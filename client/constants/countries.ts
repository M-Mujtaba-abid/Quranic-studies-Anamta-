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

export function mapCountryToRegion(code: string, name: string): Region {
  const upperCode = code.toUpperCase();
  const upperName = name.toUpperCase();
  if (upperCode === 'PK' || upperName === 'PAKISTAN') return 'PAKISTAN';
  if (upperCode === 'AU' || upperName === 'AUSTRALIA') return 'AUSTRALIA';
  if (upperCode === 'CA' || upperName === 'CANADA') return 'CANADA';
  if (upperCode === 'DE' || upperName === 'EUROPE') return 'EUROPE';
  if (upperCode === 'SA' || upperName === 'SAUDI ARABIA') return 'KSA';
  if (upperCode === 'KW' || upperName === 'KUWAIT') return 'KUWAIT';
  if (upperCode === 'QA' || upperName === 'QATAR') return 'QATAR';
  if (upperCode === 'AE' || upperName === 'UAE' || upperName === 'UNITED ARAB EMIRATES') return 'UAE';
  if (upperCode === 'GB' || upperName === 'UNITED KINGDOM') return 'UK';
  if (upperCode === 'US' || upperName === 'UNITED STATES') return 'US';
  return 'OTHERS';
}

export function getCurrencySymbol(currency: string): string {
  switch (currency) {
    case 'USD': return '$';
    case 'AUD': return 'A$';
    case 'CAD': return 'C$';
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'PKR': return 'Rs.';
    case 'SAR': return 'SR';
    case 'AED': return 'AED';
    case 'QAR': return 'QR';
    case 'KWD': return 'KD';
    default: return currency;
  }
}



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
