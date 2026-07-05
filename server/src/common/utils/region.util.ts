import { Region } from '@prisma/client';

// Maps a free-text country name or ISO-2/3 code (case-insensitive) to a supported
// pricing Region. Anything not listed here falls back to Region.OTHERS (USD pricing).
const COUNTRY_TO_REGION: Record<string, Region> = {
  // Pakistan (local)
  PK: Region.PAKISTAN,
  PAKISTAN: Region.PAKISTAN,

  // Australia
  AU: Region.AUSTRALIA,
  AUS: Region.AUSTRALIA,
  AUSTRALIA: Region.AUSTRALIA,

  // Canada
  CA: Region.CANADA,
  CAN: Region.CANADA,
  CANADA: Region.CANADA,

  // Saudi Arabia
  SA: Region.KSA,
  KSA: Region.KSA,
  'SAUDI ARABIA': Region.KSA,

  // Kuwait
  KW: Region.KUWAIT,
  KUWAIT: Region.KUWAIT,

  // Qatar
  QA: Region.QATAR,
  QATAR: Region.QATAR,

  // United Arab Emirates
  AE: Region.UAE,
  UAE: Region.UAE,
  'UNITED ARAB EMIRATES': Region.UAE,

  // United Kingdom
  GB: Region.UK,
  UK: Region.UK,
  'UNITED KINGDOM': Region.UK,
  ENGLAND: Region.UK,
  SCOTLAND: Region.UK,
  WALES: Region.UK,
  'NORTHERN IRELAND': Region.UK,

  // United States
  US: Region.US,
  USA: Region.US,
  'UNITED STATES': Region.US,
  'UNITED STATES OF AMERICA': Region.US,

  // Europe
  AT: Region.EUROPE,
  AUSTRIA: Region.EUROPE,
  BE: Region.EUROPE,
  BELGIUM: Region.EUROPE,
  DE: Region.EUROPE,
  GERMANY: Region.EUROPE,
  DK: Region.EUROPE,
  DENMARK: Region.EUROPE,
  ES: Region.EUROPE,
  SPAIN: Region.EUROPE,
  FI: Region.EUROPE,
  FINLAND: Region.EUROPE,
  FR: Region.EUROPE,
  FRANCE: Region.EUROPE,
  GR: Region.EUROPE,
  GREECE: Region.EUROPE,
  IE: Region.EUROPE,
  IRELAND: Region.EUROPE,
  IT: Region.EUROPE,
  ITALY: Region.EUROPE,
  NL: Region.EUROPE,
  NETHERLANDS: Region.EUROPE,
  NO: Region.EUROPE,
  NORWAY: Region.EUROPE,
  PL: Region.EUROPE,
  POLAND: Region.EUROPE,
  PT: Region.EUROPE,
  PORTUGAL: Region.EUROPE,
  SE: Region.EUROPE,
  SWEDEN: Region.EUROPE,
  CH: Region.EUROPE,
  SWITZERLAND: Region.EUROPE,
  EUROPE: Region.EUROPE,
};

export function mapCountryToRegion(country?: string | null): Region {
  if (!country) {
    return Region.OTHERS;
  }

  const normalized = country.trim().toUpperCase();

  return COUNTRY_TO_REGION[normalized] ?? Region.OTHERS;
}

export function isLocalRegion(region: Region): boolean {
  return region === Region.PAKISTAN;
}
