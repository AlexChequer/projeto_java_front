import apiRequest from './api';

// Cart service for handling cart-related API requests
const cartService = {
    // Get cart by client id
    getCartByClientId: async (clientId) => {
        return await apiRequest(`/cart/${clientId}`);
    },

    // Add item to cart
    addItemToCart: async (clientId, itemData) => {
        return await apiRequest(`/cart/${clientId}/items`, 'POST', itemData);
    },

    // Update item quantity in cart
    updateItemInCart: async (clientId, itemId, data) => {
        return await apiRequest(`/cart/${clientId}/items/${itemId}`, 'PUT', data);
    },

    // Remove item from cart
    removeItemFromCart: async (clientId, itemId) => {
        return await apiRequest(`/cart/${clientId}/items/${itemId}`, 'DELETE');
    },

    // Clear cart
    clearCart: async (clientId) => {
        return await apiRequest(`/cart/${clientId}`, 'DELETE');
    }
};

export default cartService;