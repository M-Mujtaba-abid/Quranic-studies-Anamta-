// Tracks enrollment IDs this browser has submitted, so a returning visitor can jump
// straight to their profile without typing anything — no account/login involved.
const STORAGE_KEY = 'myEnrollmentIds';

// Fired whenever the stored ids change, so components already mounted on the page (e.g. the
// navbar) can react immediately instead of only picking up the change on their next mount —
// the native `storage` event doesn't fire in the same tab that made the change.
export const MY_ENROLLMENT_IDS_CHANGED_EVENT = 'myEnrollmentIdsChanged';

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
    window.dispatchEvent(new Event(MY_ENROLLMENT_IDS_CHANGED_EVENT));
  } catch {
    // localStorage unavailable (e.g. private browsing) — non-critical, skip silently
  }
}
