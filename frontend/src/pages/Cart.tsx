import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { fetchCart, updateCartItem, removeCartItem } from '@/store/slices/cartSlice'
import { Button } from '@/components/ui/button'
import { CartItem } from '@/types'

export default function Cart() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items, isLoading } = useAppSelector((state) => state.cart)
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart())
    }
  }, [dispatch, isAuthenticated])

  useEffect(() => {
    setSelectedItems(items.map((item) => item.id))
  }, [items])

  const handleQuantityChange = async (itemId: number, quantity: number) => {
    if (quantity < 1) return
    await dispatch(updateCartItem({ itemId, quantity }))
  }

  const handleRemoveItem = async (itemId: number) => {
    await dispatch(removeCartItem(itemId))
    setSelectedItems((prev) => prev.filter((id) => id !== itemId))
  }

  const toggleSelectItem = (itemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map((item) => item.id))
    }
  }

  const getSelectedItems = (): CartItem[] => {
    return items.filter((item) => selectedItems.includes(item.id))
  }

  const calculateTotal = () => {
    return getSelectedItems().reduce((total, item) => {
      const price = item.product.price + (item.sku?.price_adjust || 0)
      return total + price * item.quantity
    }, 0)
  }

  const handleCheckout = () => {
    if (selectedItems.length === 0) return
    navigate('/checkout', { state: { cartItemIds: selectedItems } })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold mb-2">Your cart is waiting</h2>
          <p className="text-gray-500 mb-4">Login to view your cart</p>
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-4">Start shopping to add items to your cart</p>
          <Link to="/products">
            <Button>Shop Now</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Select All */}
            <div className="bg-white p-4 rounded-lg flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedItems.length === items.length}
                onChange={toggleSelectAll}
                className="w-4 h-4"
              />
              <span className="text-sm">Select All ({items.length} items)</span>
            </div>

            {/* Items */}
            {items.map((item) => {
              const price = item.product.price + (item.sku?.price_adjust || 0)
              const isSelected = selectedItems.includes(item.id)

              return (
                <div key={item.id} className="bg-white p-4 rounded-lg flex gap-4">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectItem(item.id)}
                    className="w-4 h-4 mt-8"
                  />
                  <Link to={`/products/${item.product_id}`} className="w-24 h-24 shrink-0">
                    <img
                      src={item.product.main_image || '/placeholder.jpg'}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link
                      to={`/products/${item.product_id}`}
                      className="font-medium hover:underline"
                    >
                      {item.product.name}
                    </Link>
                    {item.sku && (
                      <p className="text-sm text-gray-500 mt-1">
                        {item.sku.color} / {item.sku.size}
                      </p>
                    )}
                    <p className="text-lg font-bold mt-2">${price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-8 h-8 border rounded hover:bg-gray-100"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3 mx-auto" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-8 h-8 border rounded hover:bg-gray-100"
                      >
                        <Plus className="h-3 w-3 mx-auto" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg sticky top-24">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Selected Items</span>
                  <span>{selectedItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
              >
                Proceed to Checkout
              </Button>
              <Link
                to="/products"
                className="block text-center text-sm text-gray-500 hover:underline mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
