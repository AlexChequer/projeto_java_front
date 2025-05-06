import apiRequest from './api';

// Category service for handling category-related API requests
const categoryService = {
    // Get all categories
    getAllCategories: async () => {
        return await apiRequest('/category');
    },

    // Get category by id
    getCategoryById: async (id) => {
        return await apiRequest(`/category/${id}`);
    },

    // Create new category
    createCategory: async (categoryData) => {
        return await apiRequest('/category', 'POST', categoryData);
    },

    // Update category
    updateCategory: async (id, categoryData) => {
        return await apiRequest(`/category/${id}`, 'PUT', categoryData);
    },

    // Delete category
    deleteCategory: async (id) => {
        return await apiRequest(`/category/${id}`, 'DELETE');
    }
};

export default categoryService;