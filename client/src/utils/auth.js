// Authentication utility functions

export const getToken = () => {
  return localStorage.getItem('admin_token')
}

export const getUser = () => {
  const user = localStorage.getItem('admin_user')
  return user ? JSON.parse(user) : null
}

export const isAuthenticated = () => {
  return !!getToken()
}

export const logout = () => {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
}

export const setAuthData = (token, user) => {
  localStorage.setItem('admin_token', token)
  localStorage.setItem('admin_user', JSON.stringify(user))
}
