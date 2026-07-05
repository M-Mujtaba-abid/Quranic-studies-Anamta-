// Mirrors server/prisma/schema.prisma `Region` and `PackageTier` enums.
// Keep in sync with the backend if either enum changes.

export const REGIONS = [
  'PAKISTAN',
  'AUSTRALIA',
  'CANADA',
  'EUROPE',
  'KSA',
  'KUWAIT',
  'QATAR',
  'UAE',
  'UK',
  'US',
  'OTHERS',
] as const;

export type Region = (typeof REGIONS)[number];

export const PACKAGE_TIERS = ['BASIC', 'INTENSIVE', 'PREMIUM'] as const;

export type PackageTier = (typeof PACKAGE_TIERS)[number] | 'CUSTOM' | 'NONE';

export const LOCAL_REGION: Region = 'PAKISTAN';

export const INTERNATIONAL_REGIONS = REGIONS.filter((region) => region !== LOCAL_REGION);

interface RegionMeta {
  label: string;
  currency: string;
}

export const REGION_META: Record<Region, RegionMeta> = {
  PAKISTAN: { label: 'Pakistan (Local)', currency: 'PKR' },
  AUSTRALIA: { label: 'Australia', currency: 'AUD' },
  CANADA: { label: 'Canada', currency: 'CAD' },
  EUROPE: { label: 'Europe', currency: 'EUR' },
  KSA: { label: 'Saudi Arabia', currency: 'SAR' },
  KUWAIT: { label: 'Kuwait', currency: 'KWD' },
  QATAR: { label: 'Qatar', currency: 'QAR' },
  UAE: { label: 'UAE', currency: 'AED' },
  UK: { label: 'United Kingdom', currency: 'GBP' },
  US: { label: 'United States', currency: 'USD' },
  OTHERS: { label: 'Rest of World', currency: 'USD' },
};

export const PACKAGE_TIER_META: Record<(typeof PACKAGE_TIERS)[number], { label: string; blurb: string }> = {
  BASIC: { label: 'Basic', blurb: 'Essential access for getting started.' },
  INTENSIVE: { label: 'Intensive', blurb: 'More sessions and deeper coverage.' },
  PREMIUM: { label: 'Premium', blurb: 'The complete, fully-supported experience.' },
};
