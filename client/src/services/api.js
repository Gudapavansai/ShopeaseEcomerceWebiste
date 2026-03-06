// API Service Layer for backend communication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic API call handler
 * @param {string} endpoint - API endpoint (e.g., '/products')
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object} data - Request body data
 * @returns {Promise} API response
 */
export const apiCall = async (endpoint, method = 'GET', data = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  // Get token from localStorage (prefer adminToken for admin functions, fallback to authToken)
  const token = localStorage.getItem('adminToken') || localStorage.getItem('authToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `API Error: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============================================================================
// PRODUCT API
// ============================================================================

export const productAPI = {
  /**
   * Get all products with filters
   * @param {object} filters - Filter parameters (category, subCategory, sort)
   */
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/products?${params}`);
  },

  /**
   * Get single product by ID
   * @param {string} id - Product ID
   */
  getById: (id) => apiCall(`/products/${id}`),

  /**
   * Search products by query
   * @param {string} query - Search query
   */
  search: (query) => apiCall(`/products/search/query?q=${encodeURIComponent(query)}`),

  /**
   * Get best seller products
   */
  getBestSellers: () => apiCall('/products/best-seller/products'),
};

// ============================================================================
// AUTHENTICATION API
// ============================================================================

export const authAPI = {
  /**
   * User registration
   * @param {object} data - { name, email, password }
   */
  signup: (data) => apiCall('/auth/signup', 'POST', data),

  /**
   * User login
   * @param {object} data - { email, password }
   */
  login: (data) => apiCall('/auth/login', 'POST', data),

  /**
   * Get user profile
   * @param {string} userId - User ID
   */
  getProfile: (userId) => apiCall(`/auth/profile/${userId}`),

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {object} data - Updated user data
   */
  updateProfile: (userId, data) => apiCall(`/auth/profile/${userId}`, 'PUT', data),

  /**
   * Save delivery address
   * @param {string} userId - User ID
   * @param {object} data - Address data
   */
  saveDeliveryAddress: (userId, data) => apiCall(`/auth/delivery-address/${userId}`, 'PUT', data),

  /**
   * Get delivery address
   * @param {string} userId - User ID
   */
  getDeliveryAddress: (userId) => apiCall(`/auth/delivery-address/${userId}`),
};

// ============================================================================
// ORDER API
// ============================================================================

export const orderAPI = {
  /**
   * Create a new order
   * @param {object} data - Order data (userId, items, amount, address, paymentMethod)
   */
  create: (data) => apiCall('/orders/place', 'POST', data),

  /**
   * Get all orders for a user
   * @param {string} userId - User ID
   */
  getUserOrders: (userId) => apiCall(`/orders/user/${userId}`),

  /**
   * Get single order details
   * @param {string} orderId - Order ID
   */
  getById: (orderId) => apiCall(`/orders/${orderId}`),

  /**
   * Cancel an order
   * @param {string} orderId - Order ID
   */
  cancel: (orderId) => apiCall(`/orders/${orderId}/cancel`, 'PUT'),

  /**
   * Clear all orders for a user
   * @param {string} userId - User ID
   */
  clear: (userId) => apiCall(`/orders/user/${userId}`, 'DELETE'),

  /**
   * Update order status (Admin only)
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   */
  updateStatus: (orderId, status) => apiCall(`/orders/${orderId}/status`, 'PUT', { status }),
};

// ============================================================================
// CONTACT API
// ============================================================================

export const contactAPI = {
  /**
   * Submit contact form
   * @param {object} data - { name, email, subject, message }
   */
  submit: (data) => apiCall('/contact', 'POST', data),

  /**
   * Get all messages (Admin only)
   */
  getAll: () => apiCall('/contact'),

  /**
   * Get single message
   * @param {string} id - Message ID
   */
  getById: (id) => apiCall(`/contact/${id}`),

  /**
   * Reply to message (Admin only)
   * @param {string} id - Message ID
   * @param {string} reply - Reply text
   */
  reply: (id, reply) => apiCall(`/contact/${id}/reply`, 'PUT', { reply }),
};

// ============================================================================
// CART API
// ============================================================================

export const cartAPI = {
  /**
   * Calculate cart total
   * @param {object} items - Cart items
   */
  calculate: (items) => apiCall('/cart/calculate', 'POST', { items }),

  /**
   * Validate cart items
   * @param {object} items - Cart items
   */
  validate: (items) => apiCall('/cart/validate', 'POST', { items }),
};

// ============================================================================
// ADMIN API
// ============================================================================

export const adminAPI = {
  /**
   * Create new product (Admin only)
   * @param {object} data - Product data
   */
  createProduct: (data) => apiCall('/admin/create', 'POST', data),

  /**
   * Update product (Admin only)
   * @param {string} id - Product ID
   * @param {object} data - Updated product data
   */
  updateProduct: (id, data) => apiCall(`/admin/update/${id}`, 'PUT', data),

  /**
   * Delete product (Admin only)
   * @param {string} id - Product ID
   */
  deleteProduct: (id) => apiCall(`/admin/delete/${id}`, 'DELETE'),

  /**
   * Admin Login
   * @param {object} data - { email, password }
   */
  login: (data) => apiCall('/admin/login', 'POST', data),

  /**
   * Admin Sign Up
   * @param {object} data - { name, email, password }
   */
  signup: (data) => apiCall('/admin/signup', 'POST', data),

  /**
   * Get all products with details (Admin only)
   */
  getAll: () => apiCall('/admin/all'),
  getAllProducts: () => apiCall('/admin/all'),
};

export default {
  productAPI,
  authAPI,
  orderAPI,
  contactAPI,
  cartAPI,
  adminAPI,
};
