import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data: { username: string; email: string; password: string; phone?: string }) =>
    api.post('/auth/register', data),
  login: (data: { username: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: Partial<{ username: string; email: string; phone: string; avatar: string; password: string }>) =>
    api.put('/auth/profile', data),
}

// Products API
export const productsAPI = {
  getProducts: (params?: {
    page?: number
    per_page?: number
    category_id?: number
    keyword?: string
    sort_by?: string
    order?: string
    min_price?: number
    max_price?: number
  }) => api.get('/products', { params }),
  getProduct: (id: number) => api.get(`/products/${id}`),
  getProductReviews: (id: number, params?: { page?: number; per_page?: number }) =>
    api.get(`/products/${id}/reviews`, { params }),
  getCategories: () => api.get('/products/categories'),
  getCategory: (id: number) => api.get(`/products/categories/${id}`),
}

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data: { product_id: number; sku_id?: number; quantity?: number }) =>
    api.post('/cart', data),
  updateCartItem: (id: number, data: { quantity: number }) =>
    api.put(`/cart/${id}`, data),
  removeCartItem: (id: number) => api.delete(`/cart/${id}`),
  clearCart: () => api.delete('/cart/clear'),
}

// Favorites API
export const favoritesAPI = {
  getFavorites: (params?: { page?: number; per_page?: number }) =>
    api.get('/favorites', { params }),
  addFavorite: (productId: number) => api.post('/favorites', { product_id: productId }),
  removeFavorite: (productId: number) => api.delete(`/favorites/${productId}`),
  checkFavorite: (productId: number) => api.get(`/favorites/check/${productId}`),
}

// Orders API
export const ordersAPI = {
  getOrders: (params?: { page?: number; per_page?: number; status?: string }) =>
    api.get('/orders', { params }),
  createOrder: (data: {
    receiver_name: string
    receiver_phone: string
    receiver_address: string
    cart_item_ids: number[]
  }) => api.post('/orders', data),
  getOrder: (id: number) => api.get(`/orders/${id}`),
  cancelOrder: (id: number) => api.put(`/orders/${id}/cancel`),
  payOrder: (id: number) => api.post(`/orders/${id}/pay`),
}

// Banners API
export const bannersAPI = {
  getBanners: () => api.get('/banners'),
}

// Admin API
export const adminAPI = {
  // Dashboard
  getDashboard: () => api.get('/admin/statistics/dashboard'),

  // Products
  getProducts: (params?: { page?: number; per_page?: number }) =>
    api.get('/admin/products', { params }),
  createProduct: (data: Partial<{
    name: string
    description: string
    price: number
    original_price: number
    stock: number
    category_id: number
    main_image: string
    images: string[]
    status: string
    skus: Partial<{ size: string; color: string; stock: number; price_adjust: number }>[]
  }>) => api.post('/admin/products', data),
  updateProduct: (id: number, data: Partial<{
    name: string
    description: string
    price: number
    original_price: number
    stock: number
    category_id: number
    main_image: string
    images: string[]
    status: string
  }>) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id: number) => api.delete(`/admin/products/${id}`),

  // Categories
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data: { name: string; parent_id?: number; sort_order?: number }) =>
    api.post('/admin/categories', data),
  updateCategory: (id: number, data: { name?: string; parent_id?: number; sort_order?: number }) =>
    api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id: number) => api.delete(`/admin/categories/${id}`),

  // Orders
  getOrders: (params?: { page?: number; per_page?: number; status?: string }) =>
    api.get('/admin/orders', { params }),
  updateOrderStatus: (id: number, status: string) =>
    api.put(`/admin/orders/${id}/status`, { status }),

  // Users
  getUsers: (params?: { page?: number; per_page?: number }) =>
    api.get('/admin/users', { params }),
  updateUserStatus: (id: number, status: string) =>
    api.put(`/admin/users/${id}/status`, { status }),

  // Banners
  createBanner: (data: { title: string; image_url: string; link_url?: string; sort_order?: number; status?: string }) =>
    api.post('/banners', data),
  updateBanner: (id: number, data: Partial<{ title: string; image_url: string; link_url: string; sort_order: number; status: string }>) =>
    api.put(`/banners/${id}`, data),
  deleteBanner: (id: number) => api.delete(`/banners/${id}`),
}

export default api
