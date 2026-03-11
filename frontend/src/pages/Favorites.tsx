import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchFavorites } from '@/store/slices/favoriteSlice'
import ProductCard from '@/components/ProductCard'
import { Button } from '@/components/ui/button'

export default function Favorites() {
  const dispatch = useAppDispatch()
  const { items, isLoading } = useAppSelector((state) => state.favorites)
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites())
    }
  }, [dispatch, isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold mb-2">Your favorites are waiting</h2>
          <p className="text-gray-500 mb-4">Login to view your favorites</p>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Favorites</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold mb-2">No favorites yet</h2>
            <p className="text-gray-500 mb-4">Start adding items you love</p>
            <Link to="/products">
              <Button>Explore Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((favorite) => (
              <ProductCard key={favorite.id} product={favorite.product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
