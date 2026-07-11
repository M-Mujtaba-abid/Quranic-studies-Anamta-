// Tracks enrollment IDs this browser has submitted, so a returning visitor can jump
// straight to their profile without typing anything — no account/login involved.
const STORAGE_KEY = 'myEnrollmentIds';

export function getMyEnrollmentIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

// Appends (moving to most-recent if already present) rather than overwriting, so multiple
// enrollments from the same browser accumulate instead of only the last one being tracked.
export function addMyEnrollmentId(id: string): void {
  if (typeof window === 'undefined' || !id) return;
  try {
    const ids = getMyEnrollmentIds().filter((existingId) => existingId !== id);
    ids.push(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // localStorage unavailable (e.g. private browsing) — non-critical, skip silently
  }
}
