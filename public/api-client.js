// API Client for JobMap Application
class JobMapAPI {
    constructor(baseURL = '/api') {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('jobmap_token');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('jobmap_token', token);
        } else {
            localStorage.removeItem('jobmap_token');
        }
    }

    // Get authentication headers
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: this.getHeaders(),
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async register(userData) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        this.setToken(data.token);
        return data;
    }

    async login(credentials) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        this.setToken(data.token);
        return data;
    }

    async getMe() {
        return this.request('/auth/me');
    }

    async updateProfile(profileData) {
        return this.request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }

    logout() {
        this.setToken(null);
    }

    // Jobs endpoints
    async getJobs(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        const endpoint = queryString ? `/jobs?${queryString}` : '/jobs';
        return this.request(endpoint);
    }

    async getJob(id) {
        return this.request(`/jobs/${id}`);
    }

    async createJob(jobData) {
        return this.request('/jobs', {
            method: 'POST',
            body: JSON.stringify(jobData),
        });
    }

    async updateJob(id, jobData) {
        return this.request(`/jobs/${id}`, {
            method: 'PUT',
            body: JSON.stringify(jobData),
        });
    }

    async deleteJob(id) {
        return this.request(`/jobs/${id}`, {
            method: 'DELETE',
        });
    }

    // Candidates endpoints
    async getCandidates(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        const endpoint = queryString ? `/candidates?${queryString}` : '/candidates';
        return this.request(endpoint);
    }

    async getCandidate(id) {
        return this.request(`/candidates/${id}`);
    }

    async createCandidate(candidateData) {
        return this.request('/candidates', {
            method: 'POST',
            body: JSON.stringify(candidateData),
        });
    }

    async updateCandidate(id, candidateData) {
        return this.request(`/candidates/${id}`, {
            method: 'PUT',
            body: JSON.stringify(candidateData),
        });
    }

    async deleteCandidate(id) {
        return this.request(`/candidates/${id}`, {
            method: 'DELETE',
        });
    }

    // Favorites endpoints
    async getFavorites() {
        return this.request('/favorites');
    }

    async addFavorite(itemId, itemType) {
        return this.request('/favorites', {
            method: 'POST',
            body: JSON.stringify({ itemId, itemType }),
        });
    }

    async removeFavorite(id) {
        return this.request(`/favorites/${id}`, {
            method: 'DELETE',
        });
    }

    async removeFavoriteByItem(itemType, itemId) {
        return this.request(`/favorites/item/${itemType}/${itemId}`, {
            method: 'DELETE',
        });
    }

    // Admin endpoints
    async getStats() {
        return this.request('/admin/stats');
    }

    async getUsers(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        const endpoint = queryString ? `/admin/users?${queryString}` : '/admin/users';
        return this.request(endpoint);
    }

    async getUser(id) {
        return this.request(`/admin/users/${id}`);
    }

    async updateUser(id, userData) {
        return this.request(`/admin/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }

    async deleteUser(id) {
        return this.request(`/admin/users/${id}`, {
            method: 'DELETE',
        });
    }

    async getLogs(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        const endpoint = queryString ? `/admin/logs?${queryString}` : '/admin/logs';
        return this.request(endpoint);
    }

    async getAdminJobs(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        const endpoint = queryString ? `/admin/jobs?${queryString}` : '/admin/jobs';
        return this.request(endpoint);
    }

    async getAdminCandidates(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        const endpoint = queryString ? `/admin/candidates?${queryString}` : '/admin/candidates';
        return this.request(endpoint);
    }

    async getApplications(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        const endpoint = queryString ? `/admin/applications?${queryString}` : '/admin/applications';
        return this.request(endpoint);
    }

    async moderate(entityType, entityId, action) {
        return this.request('/admin/moderate', {
            method: 'POST',
            body: JSON.stringify({ entityType, entityId, action }),
        });
    }

    // Helper to check if user is authenticated
    isAuthenticated() {
        return !!this.token;
    }
}

// Export as global variable for use in index.html
window.JobMapAPI = JobMapAPI;
