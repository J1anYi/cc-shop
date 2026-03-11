import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { cartAPI } from '@/services/api'
import { CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  totalItems: number
  isLoading: boolean
  error: string | null
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  isLoading: false,
  error: null,
}

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await cartAPI.getCart()
    return response.data.cart_items
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch cart')
  }
})

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    { productId, skuId, quantity }: { productId: number; skuId?: number; quantity?: number },
    { rejectWithValue }
  ) => {
    try {
      await cartAPI.addToCart({ product_id: productId, sku_id: skuId, quantity })
      const response = await cartAPI.getCart()
      return response.data.cart_items
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add to cart')
    }
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }: { itemId: number; quantity: number }, { rejectWithValue }) => {
    try {
      await cartAPI.updateCartItem(itemId, { quantity })
      const response = await cartAPI.getCart()
      return response.data.cart_items
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update cart')
    }
  }
)

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (itemId: number, { rejectWithValue }) => {
    try {
      await cartAPI.removeCartItem(itemId)
      const response = await cartAPI.getCart()
      return response.data.cart_items
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to remove item')
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload
      state.totalItems = action.payload.reduce((sum, item) => sum + item.quantity, 0)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
        state.totalItems = action.payload.reduce((sum, item) => sum + item.quantity, 0)
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload
        state.totalItems = action.payload.reduce((sum, item) => sum + item.quantity, 0)
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload
        state.totalItems = action.payload.reduce((sum, item) => sum + item.quantity, 0)
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = action.payload
        state.totalItems = action.payload.reduce((sum, item) => sum + item.quantity, 0)
      })
  },
})

export const { clearCart, setCartItems } = cartSlice.actions
export default cartSlice.reducer
