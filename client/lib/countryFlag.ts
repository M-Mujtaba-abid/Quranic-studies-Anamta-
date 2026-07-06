// Maps a free-text country name (as typed by a reviewer in the testimonial form)
// to its ISO 3166-1 alpha-2 code, covering common names/aliases.
const COUNTRY_NAME_TO_ISO: Record<string, string> = {
  usa: 'us', us: 'us', 'united states': 'us', 'united states of america': 'us', america: 'us',
  uk: 'gb', 'united kingdom': 'gb', england: 'gb', britain: 'gb', 'great britain': 'gb',
  canada: 'ca',
  australia: 'au',
  pakistan: 'pk',
  'saudi arabia': 'sa', ksa: 'sa',
  uae: 'ae', 'united arab emirates': 'ae',
  qatar: 'qa',
  kuwait: 'kw',
  bahrain: 'bh',
  oman: 'om',
  india: 'in',
  bangladesh: 'bd',
  malaysia: 'my',
  indonesia: 'id',
  'south africa': 'za',
  nigeria: 'ng',
  egypt: 'eg',
  turkey: 'tr', türkiye: 'tr', turkiye: 'tr',
  germany: 'de',
  france: 'fr',
  italy: 'it',
  spain: 'es',
  netherlands: 'nl', holland: 'nl',
  sweden: 'se',
  norway: 'no',
  ireland: 'ie',
  'new zealand': 'nz',
  singapore: 'sg',
  morocco: 'ma',
  algeria: 'dz',
  tunisia: 'tn',
  jordan: 'jo',
  lebanon: 'lb',
  iraq: 'iq',
  yemen: 'ye',
  afghanistan: 'af',
  'sri lanka': 'lk',
  kenya: 'ke',
  tanzania: 'tz',
  ghana: 'gh',
  somalia: 'so',
  sudan: 'sd',
  china: 'cn',
  japan: 'jp',
  'south korea': 'kr', korea: 'kr',
  philippines: 'ph',
  thailand: 'th',
  brazil: 'br',
  mexico: 'mx',
  argentina: 'ar',
  switzerland: 'ch',
  belgium: 'be',
  austria: 'at',
  denmark: 'dk',
  finland: 'fi',
  poland: 'pl',
  russia: 'ru',
  portugal: 'pt',
  greece: 'gr',
  iran: 'ir',
  israel: 'il',
  palestine: 'ps',
  europe: 'eu',
};

// Resolves free-text country input to an ISO 3166-1 alpha-2 code (uppercase),
// or null if it can't be matched to anything known.
export function getCountryIsoCode(countryName: string): string | null {
  const key = countryName.trim().toLowerCase();
  const mapped = COUNTRY_NAME_TO_ISO[key];
  if (mapped) return mapped.toUpperCase();

  // Already a 2-letter code (e.g. "PK", "US") that isn't one of the special-cased
  // aliases above — treat it as a literal ISO 3166-1 alpha-2 code.
  if (/^[a-z]{2}$/.test(key)) return key.toUpperCase();

  return null;
}
