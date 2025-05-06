import apiRequest from './api';

// Item service for handling item-related API requests
const itemService = {
    // Get all items
    getAllItems: async () => {
        return await apiRequest('/item');
    },

    // Get item by id
    getItemById: async (id) => {
        return await apiRequest(`/item/${id}`);
    },

    // Create new item
    createItem: async (itemData) => {
        return await apiRequest('/item', 'POST', itemData);
    },

    // Update item
    updateItem: async (id, itemData) => {
        return await apiRequest(`/item/${id}`, 'PUT', itemData);
    },

    // Delete item
    deleteItem: async (id) => {
        return await apiRequest(`/item/${id}`, 'DELETE');
    },

    // Get items by category
    getItemsByCategory: async (categoryId) => {
        return await apiRequest(`/item/category/${categoryId}`);
    }
};

export default itemService;