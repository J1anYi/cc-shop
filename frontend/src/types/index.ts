export interface User {
  id: number
  username: string
  email: string
  phone?: string
  avatar?: string
  status: string
  is_admin: boolean
  created_at: string
}

export interface Category {
  id: number
  name: string
  parent_id?: number
  sort_order: number
  children?: Category[]
}

export interface ProductSKU {
  id: number
  product_id: number
  size?: string
  color?: string
  stock: number
  price_adjust: number
}

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  original_price?: number
  stock: number
  category_id?: number
  main_image?: string
  images: string[]
  status: string
  sales: number
  created_at: string
  skus?: ProductSKU[]
  category?: Category
}

export interface CartItem {
  id: number
  user_id: number
  product_id: number
  product: Product
  sku_id?: number
  sku?: ProductSKU
  quantity: number
  created_at: string
}

export interface Favorite {
  id: number
  user_id: number
  product_id: number
  product: Product
  created_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  sku_id?: number
  quantity: number
  price: number
  product_name: string
  sku_info?: string
  product_image?: string
}

export interface Order {
  id: number
  order_no: string
  user_id: number
  total_amount: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  receiver_name: string
  receiver_phone: string
  receiver_address: string
  created_at: string
  paid_at?: string
  shipped_at?: string
  delivered_at?: string
  items: OrderItem[]
}

export interface Banner {
  id: number
  title: string
  image_url: string
  link_url?: string
  sort_order: number
  status: string
}

export interface Review {
  id: number
  user_id: number
  user?: {
    id: number
    username: string
    avatar?: string
  }
  product_id: number
  rating: number
  content?: string
  images: string[]
  created_at: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface CartState {
  items: CartItem[]
  totalItems: number
  isLoading: boolean
}

export interface FavoriteState {
  items: Favorite[]
  isLoading: boolean
}
