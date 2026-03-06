/**
 * Utility helper functions
 */

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = '₹') => {
  return `${currency} ${parseFloat(amount).toFixed(2)}`;
};

/**
 * Format date
 */
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  const formats = {
    'DD/MM/YYYY': `${day}/${month}/${year}`,
    'MM/DD/YYYY': `${month}/${day}/${year}`,
    'YYYY-MM-DD': `${year}-${month}-${day}`,
  };

  return formats[format] || formats['DD/MM/YYYY'];
};

/**
 * Format time
 */
export const formatTime = (date) => {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Format date and time
 */
export const formatDateTime = (date) => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

/**
 * Get time ago (e.g., "2 hours ago")
 */
export const getTimeAgo = (date) => {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDate(date);
};

/**
 * Truncate string
 */
export const truncateString = (str, length = 50, suffix = '...') => {
  if (!str || str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
};

/**
 * Capitalize string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Slug string (URL-safe)
 */
export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]/g, '-')
    .replace(/-+/g, '-');
};

/**
 * Debounce function
 */
export const debounce = (func, wait = 500) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit = 500) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Merge objects
 */
export const mergeObjects = (...objects) => {
  return objects.reduce((merged, obj) => {
    return { ...merged, ...obj };
  }, {});
};

/**
 * Filter object by keys
 */
export const filterObjectByKeys = (obj, keys) => {
  return keys.reduce((filtered, key) => {
    if (key in obj) {
      filtered[key] = obj[key];
    }
    return filtered;
  }, {});
};

/**
 * Remove duplicates from array
 */
export const removeDuplicates = (arr) => {
  return [...new Set(arr)];
};

/**
 * Sort array of objects
 */
export const sortByKey = (arr, key, order = 'asc') => {
  const sorted = [...arr].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
  return sorted;
};

/**
 * Group array by key
 */
export const groupByKey = (arr, key) => {
  return arr.reduce((groups, item) => {
    const groupKey = item[key];
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {});
};

/**
 * Paginate array
 */
export const paginate = (arr, page = 1, pageSize = 10) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    data: arr.slice(start, end),
    total: arr.length,
    page,
    pageSize,
    totalPages: Math.ceil(arr.length / pageSize),
  };
};

/**
 * Generate random ID
 */
export const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return ((value / total) * 100).toFixed(2);
};

/**
 * Calculate discount amount
 */
export const calculateDiscount = (originalPrice, discountPercent) => {
  return (originalPrice * discountPercent / 100).toFixed(2);
};

/**
 * Calculate final price after discount
 */
export const calculateFinalPrice = (originalPrice, discountPercent) => {
  const discount = calculateDiscount(originalPrice, discountPercent);
  return (originalPrice - discount).toFixed(2);
};

/**
 * Check if value is in array
 */
export const isInArray = (arr, value) => {
  return arr.includes(value);
};

/**
 * Get unique values from array
 */
export const getUniqueValues = (arr, key) => {
  if (!key) return removeDuplicates(arr);
  return removeDuplicates(arr.map(item => item[key]));
};

/**
 * Parse query string
 */
export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString);
  const obj = {};
  for (const [key, value] of params) {
    obj[key] = value;
  }
  return obj;
};

/**
 * Convert object to query string
 */
export const objectToQueryString = (obj) => {
  return Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
};

/**
 * Sleep function (for delays)
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Get browser info
 */
export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  const isChrome = /Chrome/.test(userAgent);
  const isFirefox = /Firefox/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  const isEdge = /Edg/.test(userAgent);

  return {
    userAgent,
    isChrome,
    isFirefox,
    isSafari,
    isEdge,
  };
};

export default {
  formatCurrency,
  formatDate,
  formatTime,
  formatDateTime,
  getTimeAgo,
  truncateString,
  capitalize,
  slugify,
  debounce,
  throttle,
  deepClone,
  mergeObjects,
  filterObjectByKeys,
  removeDuplicates,
  sortByKey,
  groupByKey,
  paginate,
  generateId,
  calculatePercentage,
  calculateDiscount,
  calculateFinalPrice,
  isInArray,
  getUniqueValues,
  parseQueryString,
  objectToQueryString,
  sleep,
  getBrowserInfo,
};
