// Admin service for handling admin-related API requests
import apiRequest from './api';

const adminService = {
    // Get all admins
    getAllAdmins: async () => {
        return await apiRequest('/admin');
    },

    // Get admin by id
    getAdminById: async (id) => {
        return await apiRequest(`/admin/${id}`);
    },

    // Create new admin
    createAdmin: async (adminData) => {
        return await apiRequest('/admin', 'POST', adminData);
    },

    // Update admin
    updateAdmin: async (id, adminData) => {
        return await apiRequest(`/admin/${id}`, 'PUT', adminData);
    },

    // Delete admin
    deleteAdmin: async (id) => {
        return await apiRequest(`/admin/${id}`, 'DELETE');
    }
};

export default adminService;