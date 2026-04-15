import { getToken, logout } from './auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Base URL for stored files: http://localhost:8000/storage
export const STORAGE_URL = API_BASE_URL.replace(/\/api$/, '') + '/storage'

// Public API client
export const apiClient = {
  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
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
    'Accept': 'application/json',
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

// Multipart upload request (for FormData with files — no Content-Type header so browser sets boundary)
const uploadRequest = async (endpoint, formData) => {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    body: formData,
  })

  const data = await response.json()

  if (response.status === 401) {
    logout()
    window.location.href = '/admin'
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    throw new Error(data.message || 'Upload failed')
  }

  return data
}

// FAQ API
export const faqAPI = {
  // Public — supports ?page=home|contact|web-development|… filter
  getPublic: (page) => {
    const url = page
      ? `${API_BASE_URL}/faqs?page=${encodeURIComponent(page)}`
      : `${API_BASE_URL}/faqs`
    return fetch(url, { headers: { 'Accept': 'application/json' } }).then((r) => r.json())
  },

  // Admin — auth required
  getAll: () => apiRequest('/admin/faqs'),

  create: (data) =>
    apiRequest('/admin/faqs', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    apiRequest(`/admin/faqs/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  delete: (id) => apiRequest(`/admin/faqs/${id}`, { method: 'DELETE' }),
}

// Testimonial API
export const testimonialAPI = {
  // Public — no auth needed
  getPublic: () =>
    fetch(`${API_BASE_URL}/testimonials`, { headers: { 'Accept': 'application/json' } })
      .then((r) => r.json()),

  // Admin — auth required
  getAll: () => apiRequest('/admin/testimonials'),

  create: (data) =>
    apiRequest('/admin/testimonials', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    apiRequest(`/admin/testimonials/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  delete: (id) => apiRequest(`/admin/testimonials/${id}`, { method: 'DELETE' }),
}

// Project API
export const projectAPI = {
  // Public — no auth needed
  getPublic: () =>
    fetch(`${API_BASE_URL}/projects`, { headers: { 'Accept': 'application/json' } })
      .then((r) => r.json()),

  getById: (id) =>
    fetch(`${API_BASE_URL}/projects/${id}`, { headers: { 'Accept': 'application/json' } })
      .then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.message || 'Not found'); return d }),

  // Admin — auth required
  getAll: () => apiRequest('/admin/projects'),

  create: (formData) => uploadRequest('/admin/projects', formData),

  update: (id, formData) => uploadRequest(`/admin/projects/${id}`, formData),

  delete: (id) => apiRequest(`/admin/projects/${id}`, { method: 'DELETE' }),
}
