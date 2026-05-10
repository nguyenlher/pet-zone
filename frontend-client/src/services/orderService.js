import api from './api';

// ============================================
// ORDER SERVICE - All endpoints require JWT
// ============================================

const orderService = {
  /**
   * Create a new order
   * @param {Object} orderData - Order data
   * @param {string} orderData.userId - User ID (UUID)
   * @param {Array} orderData.items - Array of {itemType: 'PET'|'PRODUCT', itemId: UUID, quantity: number}
   * @param {Object} orderData.shipping - Shipping details {name, phone, address, city, paymentMethod}
   * @param {string} orderData.discountCode - Optional discount code
   * @returns {Promise} CreateOrderResponse
   */
  async createOrder(orderData) {
    const response = await api.post('/api/public/order/create', orderData);
    return response.data;
  },

  /**
   * Get user's orders (paginated)
   * @param {number} page - Page number (0-indexed)
   * @param {number} size - Page size
   * @returns {Promise} Page of user's orders
   */
  async getUserOrders(page = 0, size = 10) {
    const response = await api.get('/api/public/order/user', {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Cancel an order
   * @param {string} orderId - Order ID (UUID)
   * @param {string} reason - Optional cancellation reason
   * @returns {Promise} CancelOrderResponse
   */
  async cancelOrder(orderId, reason = '') {
    const response = await api.post('/api/public/order/cancel', {
      orderId,
      reason
    });
    return response.data;
  },

  /**
   * Get order by ID
   * @param {string} orderId - Order ID (UUID)
   * @returns {Promise} Order details
   */
  async getOrderById(orderId) {
    const response = await api.get(`/api/public/order/${orderId}`);
    return response.data;
  }
};

export default orderService;
