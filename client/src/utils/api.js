import { getToken, logout } from './auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Public API client
export const apiClient = {
  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || `HTTP error! status: ${response.status}`)
    }

    return result
  },
}

// Submit enquiry (public)
export const submitEnquiry = async (data) => {
  return apiClient.post('/enquiry', data)
}

// Authenticated API request
export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken()

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config = { ...options, headers }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
  const data = await response.json()

  if (response.status === 401) {
    logout()
    window.location.href = '/admin'
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    throw new Error(data.message || 'API request failed')
  }

  return data
}

// Admin API endpoints
export const adminAPI = {
  // Auth
  login: (credentials) =>
    apiRequest('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  logout: () =>
    apiRequest('/admin/logout', { method: 'POST' }),

  me: () =>
    apiRequest('/admin/me'),

  // Dashboard
  getStats: () =>
    apiRequest('/admin/stats'),

  // Enquiries
  getEnquiries: (serviceType, status) => {
    const params = new URLSearchParams()
    if (serviceType) params.set('service', serviceType)
    if (status) params.set('status', status)
    const qs = params.toString()
    return apiRequest(`/admin/enquiries${qs ? `?${qs}` : ''}`)
  },

  updateEnquiryStatus: (id, status) =>
    apiRequest(`/admin/enquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  addEnquiryComment: (id, comment) =>
    apiRequest(`/admin/enquiries/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    }),

  deleteEnquiry: (id) =>
    apiRequest(`/admin/enquiries/${id}`, { method: 'DELETE' }),
}
