import type { ComponentType } from "react";
import { Globe2 } from "lucide-react";
import * as Flags from "country-flag-icons/react/3x2";
import { getCountryIsoCode } from "@/lib/countryFlag";

interface CountryFlagProps {
  country: string;
  className?: string;
}

// Renders a real SVG flag for free-text country input (e.g. "Pakistan", "UK", "PK").
// Uses actual flag artwork rather than Unicode flag emoji, since regional-indicator
// emoji rely on OS/browser font support and silently render as plain letters
// (e.g. "PK") on systems without that support.
export function CountryFlag({ country, className = "h-4 w-5" }: CountryFlagProps) {
  const isoCode = getCountryIsoCode(country);
  const FlagComponent = isoCode ? (Flags as Record<string, ComponentType<any>>)[isoCode] : undefined;

  if (!FlagComponent) {
    return <Globe2 className={className} aria-label={country} />;
  }

  return <FlagComponent className={`${className} rounded-[2px]`} title={country} aria-label={country} />;
}
