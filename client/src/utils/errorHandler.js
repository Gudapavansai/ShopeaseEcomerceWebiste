import { toast } from 'react-toastify';
import { ERROR_MESSAGES } from '../config/api';

/**
 * Global error handler
 */
class ErrorHandler {
  /**
   * Handle different types of errors
   */
  static handle(error, showToast = true) {
    let message = ERROR_MESSAGES.UNKNOWN_ERROR;

    if (error instanceof TypeError) {
      message = ERROR_MESSAGES.NETWORK_ERROR;
    } else if (error.response) {
      // API error with response
      const status = error.response.status;
      const data = error.response.data;

      message = data?.message || this.getMessageByStatus(status);
    } else if (error.message) {
      message = error.message;
    }

    if (showToast) {
      this.showError(message);
    }

    return message;
  }

  /**
   * Get error message by HTTP status code
   */
  static getMessageByStatus(status) {
    const messages = {
      400: ERROR_MESSAGES.VALIDATION_ERROR,
      401: ERROR_MESSAGES.UNAUTHORIZED,
      403: ERROR_MESSAGES.FORBIDDEN,
      404: ERROR_MESSAGES.NOT_FOUND,
      500: ERROR_MESSAGES.SERVER_ERROR,
      503: 'Service unavailable. Please try again later.',
    };

    return messages[status] || ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  /**
   * Show error toast
   */
  static showError(message) {
    toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  /**
   * Show success toast
   */
  static showSuccess(message) {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  /**
   * Show info toast
   */
  static showInfo(message) {
    toast.info(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  /**
   * Show warning toast
   */
  static showWarning(message) {
    toast.warning(message, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  /**
   * Validate form fields
   */
  static validateForm(data, rules) {
    const errors = {};

    Object.keys(rules).forEach(field => {
      const rule = rules[field];
      const value = data[field];

      if (rule.required && (!value || value.trim() === '')) {
        errors[field] = `${field} is required`;
        return;
      }

      if (rule.minLength && value && value.length < rule.minLength) {
        errors[field] = `${field} must be at least ${rule.minLength} characters`;
        return;
      }

      if (rule.maxLength && value && value.length > rule.maxLength) {
        errors[field] = `${field} must be no more than ${rule.maxLength} characters`;
        return;
      }

      if (rule.pattern && value && !rule.pattern.test(value)) {
        errors[field] = rule.errorMessage || `${field} is invalid`;
        return;
      }

      if (rule.custom && value) {
        const customError = rule.custom(value);
        if (customError) {
          errors[field] = customError;
        }
      }
    });

    return errors;
  }

  /**
   * Check if form has errors
   */
  static hasErrors(errors) {
    return Object.keys(errors).length > 0;
  }

  /**
   * Get first error message
   */
  static getFirstError(errors) {
    const firstErrorKey = Object.keys(errors)[0];
    return errors[firstErrorKey] || null;
  }

  /**
   * Log error for debugging
   */
  static log(error, context = '') {
    if (process.env.VITE_DEBUG === 'true') {
      console.error(`[Error ${context}]:`, error);
    }
  }
}

export default ErrorHandler;
