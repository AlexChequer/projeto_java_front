// Base API configuration
const API_URL = 'http://localhost:8080';

// Helper function for API requests
async function apiRequest(url, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Add authentication token if available
    const token = localStorage.getItem('authToken');
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        console.log(`API Request: ${method} ${API_URL}${url}`);
        const response = await fetch(`${API_URL}${url}`, options);
        
        // Handle common HTTP status codes
        if (response.status === 401) {
            // Unauthorized - clear auth data and redirect to login
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
            throw new Error('Authentication required. Please log in again.');
        }
        
        if (response.status === 403) {
            throw new Error('You do not have permission to perform this action.');
        }
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `API request failed: ${response.status}`);
        }

        // Check if response has content
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            const jsonData = await response.json();
            console.log('API Response:', jsonData);
            
            // Verifica se é um array vazio e retorna um array vazio em vez de null
            if (Array.isArray(jsonData) && jsonData.length === 0) {
                return [];
            }
            
            return jsonData;
        }
        
        if (response.status === 204) {
            return null; // No content response
        }
        
        return true; // Return true for successful requests with no content
    } catch (error) {
        console.error('API request error:', error);
        // Retorna um array vazio em caso de erro em chamadas que devem retornar listas
        if (url.includes('getAllItems') || url.includes('/item') || 
            url.includes('/client') || url.includes('/admin') || 
            url.includes('/order') || url.includes('/category')) {
            console.warn('Retornando array vazio para chamada que falhou:', url);
            return [];
        }
        throw error;
    }
}

// Simplified login function
export async function login(email, password, userType = 'CLIENT') {
    try {
        // Call the simple login endpoint
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, userType }),
        });

        if (!response.ok) {
            return false; // Login failed
        }

        // Get the boolean result
        const isAuthenticated = await response.json();
        
        if (isAuthenticated) {
            // If login is successful, store basic user info
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userType', userType);
            localStorage.setItem('userEmail', email);
            
            // If it's a client login, get the client ID
            if (userType === 'CLIENT') {
                // Fetch client ID based on email
                const clients = await apiRequest('/client');
                const client = Array.isArray(clients) ? clients.find(c => c.email === email) : null;
                if (client) {
                    localStorage.setItem('clientId', client.id);
                    localStorage.setItem('userName', client.name);
                }
            } else if (userType === 'ADMIN') {
                // Fetch admin info based on email
                const admins = await apiRequest('/admin');
                const admin = Array.isArray(admins) ? admins.find(a => a.email === email) : null;
                if (admin) {
                    localStorage.setItem('adminId', admin.id);
                    localStorage.setItem('userName', admin.name);
                }
            }
        }
        
        return isAuthenticated;
    } catch (error) {
        console.error('Login error:', error);
        return false;
    }
}

// Logout function
export function logout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('clientId');
    localStorage.removeItem('adminId');
    localStorage.removeItem('userName');
    window.location.href = '/login';
}

// Check if user is authenticated
export function isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
}

// Get current user type
export function getUserType() {
    return localStorage.getItem('userType');
}

// Check if user is admin
export function isAdmin() {
    return localStorage.getItem('userType') === 'ADMIN';
}

export default apiRequest;