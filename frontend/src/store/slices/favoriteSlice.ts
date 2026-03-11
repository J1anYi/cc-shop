import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { favoritesAPI } from '@/services/api'
import { Favorite } from '@/types'

interface FavoriteState {
  items: Favorite[]
  isLoading: boolean
  error: string | null
}

const initialState: FavoriteState = {
  items: [],
  isLoading: false,
  error: null,
}

export const fetchFavorites = createAsyncThunk('favorites/fetchFavorites', async (_, { rejectWithValue }) => {
  try {
    const response = await favoritesAPI.getFavorites()
    return response.data.favorites
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch favorites')
  }
})

export const addFavorite = createAsyncThunk(
  'favorites/addFavorite',
  async (productId: number, { rejectWithValue }) => {
    try {
      await favoritesAPI.addFavorite(productId)
      const response = await favoritesAPI.getFavorites()
      return response.data.favorites
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add favorite')
    }
  }
)

export const removeFavorite = createAsyncThunk(
  'favorites/removeFavorite',
  async (productId: number, { rejectWithValue }) => {
    try {
      await favoritesAPI.removeFavorite(productId)
      const response = await favoritesAPI.getFavorites()
      return response.data.favorites
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to remove favorite')
    }
  }
)

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<Favorite[]>) => {
      state.items = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = action.payload
      })
  },
})

export const { setFavorites } = favoriteSlice.actions
export default favoriteSlice.reducer
