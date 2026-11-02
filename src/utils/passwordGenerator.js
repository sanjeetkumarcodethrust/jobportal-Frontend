/**
 * Generates an 8-character (or custom length) strong password
 * Guaranteeing at least:
 * - 1 Uppercase letter (A-Z)
 * - 1 Lowercase letter (a-z)
 * - 1 Number (0-9)
 * - 1 Symbol (!@#$%^&*...)
 *
 * @param {number} length - Default 8
 * @returns {string} - Generated secure password
 */
export const generatePassword = (length = 8) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=';

  // Guarantee at least 1 of each required category
  const requiredChars = [
    uppercase[Math.floor(Math.random() * uppercase.length)],
    lowercase[Math.floor(Math.random() * lowercase.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  const allChars = uppercase + lowercase + numbers + symbols;
  while (requiredChars.length < length) {
    requiredChars.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  // Shuffle characters so the positions are completely random
  return requiredChars.sort(() => Math.random() - 0.5).join('');
};

/**
 * Validates if a password meets the required criteria:
 * - At least 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 symbol
 * - At least 1 number
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|;:,.<>?]).{8,}$/;
  return regex.test(password);
};

