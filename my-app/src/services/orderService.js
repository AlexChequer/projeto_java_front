import apiRequest from './api';

// Order service for handling order-related API requests
const orderService = {
    // Get all orders
    getAllOrders: async () => {
        return await apiRequest('/order');
    },

    // Get order by id
    getOrderById: async (id) => {
        return await apiRequest(`/order/${id}`);
    },

    // Get orders by client id
    getOrdersByClientId: async (clientId) => {
        return await apiRequest(`/order/client/${clientId}`);
    },

    // Create new order
    createOrder: async (clientId, itemData) => {
        return await apiRequest(`/order/${clientId}`, 'POST', itemData);
    },

    // Delete order
    deleteOrder: async (id) => {
        return await apiRequest(`/order/${id}`, 'DELETE');
    },

    // Checkout process
    checkout: async (clientId) => {
        return await apiRequest(`/order/${clientId}/checkout`, 'POST');
    },

    // Process payment
    processPayment: async (orderId, paymentData) => {
        return await apiRequest(`/order/${orderId}/payment`, 'POST', paymentData);
    },

    // Update order status
    updateOrderStatus: async (orderId, statusData) => {
        return await apiRequest(`/order/${orderId}/status`, 'PUT', statusData);
    }
};

export default orderService;