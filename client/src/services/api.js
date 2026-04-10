const getBaseUrl = () => {
    return import.meta.env.API_URL || import.meta.env.VITE_API_URL || '';
};

const getHeaders = (customHeaders = {}) => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...customHeaders
    };
};

const handleResponse = async (response) => {
    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('user');
        window.location.href = '/';
        throw new Error('Sessão expirada. Faça login novamente.');
    }

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (err) {
            errorData = { message: response.statusText };
        }
        throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    if (response.status === 204) return null;
    return response.json();
};

export const api = {
    get: async (endpoint, customHeaders = {}) => {
        const response = await fetch(`${getBaseUrl()}${endpoint}`, {
            method: 'GET',
            headers: getHeaders(customHeaders)
        });
        return handleResponse(response);
    },

    post: async (endpoint, data, customHeaders = {}) => {
        const response = await fetch(`${getBaseUrl()}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(customHeaders),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    put: async (endpoint, data, customHeaders = {}) => {
        const response = await fetch(`${getBaseUrl()}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(customHeaders),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    delete: async (endpoint, customHeaders = {}) => {
        const response = await fetch(`${getBaseUrl()}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(customHeaders)
        });
        return handleResponse(response);
    }
};
