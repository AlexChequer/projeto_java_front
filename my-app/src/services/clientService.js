import apiRequest from './api';

// Client service for handling client-related API requests
const clientService = {
    // Get all clients
    getAllClients: async () => {
        return await apiRequest('/client');
    },

    // Get client by id
    getClientById: async (id) => {
        return await apiRequest(`/client/${id}`);
    },

    // Create new client (register)
    registerClient: async (clientData) => {
        return await apiRequest('/client', 'POST', clientData);
    },

    // Update client
    updateClient: async (id, clientData) => {
        return await apiRequest(`/client/${id}`, 'PUT', clientData);
    },

    // Delete client
    deleteClient: async (id) => {
        return await apiRequest(`/client/${id}`, 'DELETE');
    }
};

export default clientService;