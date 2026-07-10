import * as countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(en);

// Informal/colloquial country references that free-text input commonly uses but which
// aren't resolvable via the official ISO 3166 name list (constituent countries, old
// names, shorthand). Everything else is resolved through i18n-iso-countries, which
// covers all ~195 ISO countries and is already case-insensitive.
const ALIASES: Record<string, string> = {
  usa: 'US',
  america: 'US',
  uk: 'GB',
  britain: 'GB',
  'great britain': 'GB',
  england: 'GB',
  scotland: 'GB',
  wales: 'GB',
  'northern ireland': 'GB',
  holland: 'NL',
  ksa: 'SA',
  uae: 'AE',
  turkiye: 'TR',
  korea: 'KR',
};

// Resolves free-text country input (as typed by a reviewer in the testimonial form) to
// an ISO 3166-1 alpha-2 code (uppercase), or null if it can't be matched to anything known.
export function getCountryIsoCode(countryName: string): string | null {
  const trimmed = countryName.trim();
  if (!trimmed) return null;

  const key = trimmed.toLowerCase();
  if (ALIASES[key]) return ALIASES[key];

  const isoMatch = countries.getAlpha2Code(trimmed, 'en');
  if (isoMatch) return isoMatch;

  // Already a bare 2-letter code (e.g. "PK", "US") — validate it's a real ISO code
  // before trusting it, rather than blindly uppercasing arbitrary two-letter input.
  if (/^[a-z]{2}$/i.test(key) && countries.isValid(key)) {
    return key.toUpperCase();
  }

  return null;
}
