import axios from 'axios';

// Helper to get CSRF token (Django requires this for POST/PUT/DELETE)
const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

// ApiInstance.js
const ApiInstance = axios.create({
    baseURL: '/',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});
ApiInstance.interceptors.request.use(
    (config) => {
        // We DO NOT attach Authorization header here. 
        // The browser automatically attaches the 'access_token' cookie.

        // CSRF Token logic (Required for Django Session/Cookie Auth)
        if (['post', 'put', 'delete', 'patch'].includes(config.method)) {
            const csrfToken = getCookie('csrftoken');
            if (csrfToken) {
                config.headers['X-CSRFToken'] = csrfToken;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. Response Interceptor: Auto-Refresh using Cookies
ApiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // We send a POST to refresh. 
                // We do NOT send data. The browser sends the 'refresh_token' cookie automatically.
                await axios.post('/api/token/refresh/', {}, {
                    withCredentials: true
                });

                // If successful, the server set a new 'access_token' cookie.
                // We just retry the original request.
                return ApiInstance(originalRequest);

            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                // Optional: Call a logout endpoint to clear cookies on server
                // window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default ApiInstance;