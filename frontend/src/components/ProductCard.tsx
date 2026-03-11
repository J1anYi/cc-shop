import { Link } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { addToCart } from '@/store/slices/cartSlice'
import { addFavorite, removeFavorite } from '@/store/slices/favoriteSlice'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { items: favorites } = useAppSelector((state) => state.favorites)
  const [isAdding, setIsAdding] = useState(false)

  const isFavorite = favorites.some((f) => f.product_id === product.id)

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }

    setIsAdding(true)
    try {
      await dispatch(addToCart({ productId: product.id }))
    } finally {
      setIsAdding(false)
    }
  }

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }

    if (isFavorite) {
      await dispatch(removeFavorite(product.id))
    } else {
      await dispatch(addFavorite(product.id))
    }
  }

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <Link to={`/products/${product.id}`}>
        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={product.main_image || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Discount Badge */}
      {discount > 0 && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
          -{discount}%
        </span>
      )}

      {/* Quick Actions */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleToggleFavorite}
          className={`p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition ${
            isFavorite ? 'text-red-500' : 'text-gray-600'
          }`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition text-gray-600 disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-medium text-sm mb-1 hover:text-gray-600 transition line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-semibold">${product.price.toFixed(2)}</span>
          {product.original_price && (
            <span className="text-sm text-gray-400 line-through">
              ${product.original_price.toFixed(2)}
            </span>
          )}
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {product.sales} sold
        </div>
      </div>
    </div>
  )
}
