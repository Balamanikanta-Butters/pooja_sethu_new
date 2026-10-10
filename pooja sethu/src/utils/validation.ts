/**
 * Centralized Validation Utility
 * --------------------------------
 * All form validation rules live here.
 * Each validator returns { valid: boolean, message: string }.
 * Components call these as the user types (real-time) or on submit.
 */

export type ValidationResult = { valid: boolean; message: string };

// ─── Phone / Mobile ───────────────────────────────────────────────────────────

export function validateMobile(value: string): ValidationResult {
  if (value.length === 0) return { valid: false, message: 'Please enter your mobile number.' };
  if (/[^0-9]/.test(value)) return { valid: false, message: '📵 Only numbers are allowed here.' };
  if (value.length < 10) return { valid: false, message: `Still needs ${10 - value.length} more digit${10 - value.length > 1 ? 's' : ''}.` };
  if (value.startsWith('0')) return { valid: false, message: 'Mobile numbers cannot start with 0.' };
  return { valid: true, message: '' };
}

// ─── OTP ──────────────────────────────────────────────────────────────────────

export function validateOtp(value: string): ValidationResult {
  if (value.length === 0) return { valid: false, message: 'Please enter the OTP sent to your number.' };
  if (/[^0-9]/.test(value)) return { valid: false, message: '🔢 OTP should only contain numbers.' };
  if (value.length < 4) return { valid: false, message: `Enter all 4 digits of the OTP.` };
  return { valid: true, message: '' };
}

// ─── Name ─────────────────────────────────────────────────────────────────────

export function validateName(value: string, fieldLabel = 'Name'): ValidationResult {
  if (value.trim().length === 0) return { valid: false, message: `${fieldLabel} cannot be empty.` };
  if (/[0-9]/.test(value)) return { valid: false, message: `🚫 Numbers are not allowed in ${fieldLabel}.` };
  if (/[^a-zA-Z\s\u0C00-\u0C7F]/.test(value)) return { valid: false, message: `${fieldLabel} should only contain letters.` };
  if (value.trim().length < 2) return { valid: false, message: `${fieldLabel} must be at least 2 characters.` };
  return { valid: true, message: '' };
}

// ─── Email ────────────────────────────────────────────────────────────────────

export function validateEmail(value: string): ValidationResult {
  if (value.trim().length === 0) return { valid: false, message: 'Email address cannot be empty.' };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return { valid: false, message: '✉️ Please enter a valid email (e.g. name@gmail.com).' };
  return { valid: true, message: '' };
}

// ─── Gotra ────────────────────────────────────────────────────────────────────

export function validateGotra(value: string): ValidationResult {
  if (value.trim().length === 0) return { valid: false, message: 'Gotra cannot be empty.' };
  if (/[0-9]/.test(value)) return { valid: false, message: '🚫 Numbers are not allowed in Gotra.' };
  return { valid: true, message: '' };
}

// ─── Guests / Numbers ─────────────────────────────────────────────────────────

export function validateGuestCount(value: string): ValidationResult {
  if (value.trim().length === 0) return { valid: false, message: 'Please enter expected number of guests.' };
  if (/[^0-9]/.test(value)) return { valid: false, message: '🔢 Guest count must be a number (e.g. 25).' };
  const num = parseInt(value, 10);
  if (num < 1) return { valid: false, message: 'Guest count must be at least 1.' };
  if (num > 1000) return { valid: false, message: 'That seems too many guests! Max is 1000.' };
  return { valid: true, message: '' };
}

// ─── Address ──────────────────────────────────────────────────────────────────

export function validateAddress(value: string, fieldLabel = 'Address'): ValidationResult {
  if (value.trim().length === 0) return { valid: false, message: `${fieldLabel} cannot be empty.` };
  if (value.trim().length < 5) return { valid: false, message: `${fieldLabel} is too short. Please be more specific.` };
  return { valid: true, message: '' };
}

// ─── Pincode ──────────────────────────────────────────────────────────────────

export function validatePincode(value: string): ValidationResult {
  if (value.trim().length === 0) return { valid: false, message: 'Please select a pincode.' };
  if (/[^0-9]/.test(value)) return { valid: false, message: '🔢 Pincode must be numeric.' };
  if (value.length !== 6) return { valid: false, message: 'Pincode must be exactly 6 digits.' };
  return { valid: true, message: '' };
}

// ─── "Booked for" phone ───────────────────────────────────────────────────────

export function validateBookingPhone(value: string): ValidationResult {
  if (value.trim().length === 0) return { valid: false, message: "Please enter their phone number." };
  return validateMobile(value);
}

// ─── API Error Messages (random friendly messages by status code) ──────────────

const apiErrors: Record<number | string, string[]> = {
  400: [
    'Hmm, something looks off with your request. Please check and try again.',
    'We couldn\'t process that. Please review the details.',
  ],
  401: [
    'Please log in to continue.',
    'Your session might have expired. Log in again.',
  ],
  403: [
    'You don\'t have permission to do that.',
    'This action needs a different account level.',
  ],
  404: [
    'We looked everywhere, but couldn\'t find it.',
    'Oops! That page seems to have wandered off.',
    'Nothing found here. Maybe try again?',
  ],
  429: [
    'Too many attempts. Please wait a moment and try again.',
    'Slow down! Give it a few seconds.',
  ],
  500: [
    'Our server had a hiccup. Please try again shortly.',
    'Something went wrong on our end. We\'re on it!',
    'Technical trouble. Please retry in a moment.',
  ],
  503: [
    'We\'re temporarily down. Back very soon!',
    'Maintenance break. Try again in a few minutes.',
  ],
  network: [
    'No internet connection. Please check your network.',
    'Can\'t reach the server. Are you online?',
    'Network issue detected. Please try again.',
  ],
  default: [
    'Something unexpected happened. Please try again.',
    'We hit a snag! Give it another go.',
    'That didn\'t work. Please try once more.',
  ],
};

export function getApiErrorMessage(statusCode?: number): string {
  const key = statusCode && apiErrors[statusCode] ? statusCode : 'default';
  const messages = apiErrors[key];
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Smart fetch wrapper — replaces raw fetch() across the app.
 * - On success (2xx): returns parsed JSON data.
 * - On error: throws a user-friendly string instead of raw status codes.
 */
export async function apiFetch(url: string, options?: RequestInit): Promise<any> {
  try {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      return data;
    }

    // Server returned an error status — show friendly message
    throw new Error(getApiErrorMessage(response.status));
  } catch (err: any) {
    // Network error (no internet, server unreachable)
    if (err.message === 'Network request failed' || err.message?.includes('fetch')) {
      throw new Error(getApiErrorMessage('network' as any));
    }
    // Re-throw already-friendly errors from above
    throw err;
  }
}
