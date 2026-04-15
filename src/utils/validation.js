/**
 * Client-side validation utilities.
 */

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

export function isValidName(value) {
  return value.trim().length >= 2
}
