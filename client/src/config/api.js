// API Configuration and Constants

// Base URL for API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  SEARCH_PRODUCTS: (query) => `/products/search/query?q=${query}`,
  BEST_SELLERS: '/products/best-seller/products',

  // Authentication
  SIGNUP: '/auth/signup',
  LOGIN: '/auth/login',
  USER_PROFILE: (userId) => `/auth/profile/${userId}`,
  UPDATE_PROFILE: (userId) => `/auth/profile/${userId}`,

  // Orders
  CREATE_ORDER: '/orders/place',
  USER_ORDERS: (userId) => `/orders/user/${userId}`,
  ORDER_BY_ID: (orderId) => `/orders/${orderId}`,
  CANCEL_ORDER: (orderId) => `/orders/${orderId}/cancel`,
  UPDATE_ORDER_STATUS: (orderId) => `/orders/${orderId}/status`,

  // Contact
  SUBMIT_CONTACT: '/contact',
  GET_CONTACTS: '/contact',
  CONTACT_BY_ID: (id) => `/contact/${id}`,
  REPLY_CONTACT: (id) => `/contact/${id}/reply`,

  // Cart
  CALCULATE_CART: '/cart/calculate',
  VALIDATE_CART: '/cart/validate',

  // Admin
  CREATE_PRODUCT: '/admin/create',
  UPDATE_PRODUCT: (id) => `/admin/update/${id}`,
  DELETE_PRODUCT: (id) => `/admin/delete/${id}`,
  GET_ALL_PRODUCTS: '/admin/all',
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};

// Response Status
export const RESPONSE_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  PENDING: 'pending',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Unauthorized. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
};

// Order Status
export const ORDER_STATUS = {
  PLACED: 'Order Placed',
  PACKING: 'Packing',
  SHIPPED: 'Shipped',
  IN_TRANSIT: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

// Payment Methods
export const PAYMENT_METHODS = {
  COD: 'COD',
  CREDIT_CARD: 'Credit Card',
  DEBIT_CARD: 'Debit Card',
  UPI: 'UPI',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
};

// Contact Status
export const CONTACT_STATUS = {
  NEW: 'New',
  READ: 'Read',
  REPLIED: 'Replied',
  CLOSED: 'Closed',
};

// Product Categories
export const CATEGORIES = {
  WOMEN: 'Women',
  MEN: 'Men',
  KIDS: 'Kids',
};

// Product Subcategories
export const SUBCATEGORIES = {
  TOPWEAR: 'Topwear',
  BOTTOMWEAR: 'Bottomwear',
  WINTERWEAR: 'Winterwear',
};

// Sizes
export const SIZES = {
  XS: 'XS',
  S: 'S',
  M: 'M',
  L: 'L',
  XL: 'XL',
  XXL: 'XXL',
};

// Token Keys
export const TOKEN_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
  REFRESH_TOKEN: 'refreshToken',
};

// API Timeouts (in milliseconds)
export const API_TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  PHONE: /^[0-9]{10}$/,
  ZIPCODE: /^[0-9]{5,6}$/,
};

// Currency
export const CURRENCY = {
  SYMBOL: '₹',
  CODE: 'INR',
};

// Delivery Fee
export const DELIVERY_FEE = 10;

// Discount
export const DISCOUNT = {
  MIN_AMOUNT: 500,
  PERCENTAGE: 10,
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  HTTP_METHODS,
  RESPONSE_STATUS,
  ERROR_MESSAGES,
  ORDER_STATUS,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  CONTACT_STATUS,
  CATEGORIES,
  SUBCATEGORIES,
  SIZES,
  TOKEN_KEYS,
  API_TIMEOUTS,
  PAGINATION,
  VALIDATION_RULES,
  CURRENCY,
  DELIVERY_FEE,
  DISCOUNT,
};
