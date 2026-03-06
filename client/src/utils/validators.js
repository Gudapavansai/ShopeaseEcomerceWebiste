import { VALIDATION_RULES } from '../config/api';

/**
 * Input validation utilities
 */
class Validators {
  /**
   * Validate email
   */
  static isValidEmail(email) {
    return VALIDATION_RULES.EMAIL.test(email);
  }

  /**
   * Validate password strength
   */
  static isValidPassword(password) {
    return password && password.length >= VALIDATION_RULES.PASSWORD_MIN_LENGTH;
  }

  /**
   * Validate phone number
   */
  static isValidPhone(phone) {
    return VALIDATION_RULES.PHONE.test(phone);
  }

  /**
   * Validate zipcode
   */
  static isValidZipcode(zipcode) {
    return VALIDATION_RULES.ZIPCODE.test(zipcode);
  }

  /**
   * Validate URL
   */
  static isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate username (alphanumeric, underscore, 3-20 chars)
   */
  static isValidUsername(username) {
    const regex = /^[a-zA-Z0-9_]{3,20}$/;
    return regex.test(username);
  }

  /**
   * Validate name (letters, spaces, 2+ chars)
   */
  static isValidName(name) {
    const regex = /^[a-zA-Z\s]{2,}$/;
    return regex.test(name);
  }

  /**
   * Check if string is empty
   */
  static isEmpty(value) {
    return (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0)
    );
  }

  /**
   * Check string length
   */
  static isLengthValid(value, minLength, maxLength) {
    const length = String(value).length;
    return length >= minLength && length <= maxLength;
  }

  /**
   * Check if value matches pattern
   */
  static matchesPattern(value, pattern) {
    return pattern.test(value);
  }

  /**
   * Validate credit card number (basic Luhn algorithm)
   */
  static isValidCreditCard(cardNumber) {
    const regex = /^[0-9]{13,19}$/;
    if (!regex.test(cardNumber)) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Validate expiry date (MM/YY)
   */
  static isValidExpiryDate(expiryDate) {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(expiryDate)) return false;

    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expiryYear = parseInt(year, 10);
    const expiryMonth = parseInt(month, 10);

    if (expiryYear < currentYear) return false;
    if (expiryYear === currentYear && expiryMonth < currentMonth) return false;

    return true;
  }

  /**
   * Sanitize input (remove dangerous characters)
   */
  static sanitize(input) {
    if (typeof input !== 'string') return input;

    return input
      .replace(/[<>]/g, '') // Remove HTML brackets
      .replace(/script/gi, '') // Remove script tags
      .trim();
  }

  /**
   * Validate all fields in object
   */
  static validateObject(obj, rules) {
    const errors = {};

    Object.keys(rules).forEach(field => {
      const rule = rules[field];
      const value = obj[field];

      // Check if required
      if (rule.required && this.isEmpty(value)) {
        errors[field] = `${field} is required`;
        return;
      }

      // Skip validation if not required and empty
      if (!rule.required && this.isEmpty(value)) {
        return;
      }

      // Check length
      if (rule.minLength && !this.isLengthValid(value, rule.minLength, Infinity)) {
        errors[field] = `${field} must be at least ${rule.minLength} characters`;
        return;
      }

      if (rule.maxLength && !this.isLengthValid(value, 0, rule.maxLength)) {
        errors[field] = `${field} must not exceed ${rule.maxLength} characters`;
        return;
      }

      // Check pattern
      if (rule.pattern && !this.matchesPattern(value, rule.pattern)) {
        errors[field] = rule.message || `${field} format is invalid`;
        return;
      }

      // Check type
      if (rule.type && typeof value !== rule.type) {
        errors[field] = `${field} must be of type ${rule.type}`;
        return;
      }

      // Custom validation
      if (rule.custom && !rule.custom(value)) {
        errors[field] = rule.message || `${field} is invalid`;
      }
    });

    return errors;
  }

  /**
   * Get error message for field
   */
  static getErrorMessage(field, error) {
    if (!error) return '';

    const messages = {
      required: `${field} is required`,
      email: `Please enter a valid email address`,
      password: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`,
      phone: `Please enter a valid phone number`,
      zipcode: `Please enter a valid zipcode`,
    };

    return messages[error] || error;
  }
}

export default Validators;
