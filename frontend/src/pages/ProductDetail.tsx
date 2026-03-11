import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, Minus, Plus, Star } from 'lucide-react'
import { productsAPI } from '@/services/api'
import { Product, ProductSKU, Review } from '@/types'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { addToCart } from '@/store/slices/cartSlice'
import { addFavorite, removeFavorite } from '@/store/slices/favoriteSlice'
import ProductCard from '@/components/ProductCard'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [avgRating, setAvgRating] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSku, setSelectedSku] = useState<ProductSKU | null>(null)
  const [quantity, setQuantity] = useState(1)

  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { items: favorites } = useAppSelector((state) => state.favorites)

  const isFavorite = product ? favorites.some((f) => f.product_id === product.id) : false

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      setLoading(true)
      try {
        const [productRes, reviewsRes] = await Promise.all([
          productsAPI.getProduct(parseInt(id)),
          productsAPI.getProductReviews(parseInt(id)),
        ])
        setProduct(productRes.data.product)
        setReviews(reviewsRes.data.reviews)
        setAvgRating(reviewsRes.data.average_rating)

        // Fetch related products
        const relatedRes = await productsAPI.getProducts({
          category_id: productRes.data.product.category_id,
          per_page: 4,
        })
        setRelatedProducts(
          relatedRes.data.products.filter((p: Product) => p.id !== parseInt(id))
        )
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }

    await dispatch(addToCart({
      productId: product!.id,
      skuId: selectedSku?.id,
      quantity,
    }))
  }

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }

    if (isFavorite) {
      await dispatch(removeFavorite(product!.id))
    } else {
      await dispatch(addFavorite(product!.id))
    }
  }

  const getPrice = () => {
    if (!product) return 0
    return product.price + (selectedSku?.price_adjust || 0)
  }

  const getStock = () => {
    if (!product) return 0
    if (selectedSku) return selectedSku.stock
    return product.stock
  }

  const getAvailableColors = () => {
    if (!product?.skus) return []
    const colors = new Set(product.skus.map((sku) => sku.color).filter(Boolean))
    return Array.from(colors) as string[]
  }

  const getAvailableSizes = () => {
    if (!product?.skus) return []
    const sizes = new Set(product.skus.map((sku) => sku.size).filter(Boolean))
    return Array.from(sizes) as string[]
  }

  const selectColorSize = (color?: string, size?: string) => {
    if (!product?.skus) return
    const sku = product.skus.find(
      (s) => (color ? s.color === color : true) && (size ? s.size === size : true)
    )
    setSelectedSku(sku || null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    )
  }

  const images = product.images.length > 0 ? product.images : [product.main_image || '']

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-black">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/products" className="hover:text-black">Products</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-black">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square overflow-hidden bg-gray-100 rounded-lg mb-4">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded overflow-hidden border-2 ${
                      selectedImage === index ? 'border-black' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(avgRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({reviews.length} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold">${getPrice().toFixed(2)}</span>
              {product.original_price && (
                <span className="text-lg text-gray-400 line-through">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Color Selection */}
            {getAvailableColors().length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="flex gap-2">
                  {getAvailableColors().map((color) => (
                    <button
                      key={color}
                      onClick={() => selectColorSize(color, selectedSku?.size)}
                      className={`px-4 py-2 border rounded ${
                        selectedSku?.color === color
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-black'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {getAvailableSizes().length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Size</label>
                <div className="flex gap-2">
                  {getAvailableSizes().map((size) => (
                    <button
                      key={size}
                      onClick={() => selectColorSize(selectedSku?.color, size)}
                      className={`w-12 h-12 border rounded ${
                        selectedSku?.size === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 border rounded hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4 mx-auto" />
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(getStock(), q + 1))}
                  className="w-10 h-10 border rounded hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4 mx-auto" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {getStock()} items available
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={getStock() === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleToggleFavorite}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{review.user?.username}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600">{review.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
