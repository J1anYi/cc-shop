import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CreditCard, CheckCircle } from 'lucide-react'
import { ordersAPI } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Checkout() {
  const location = useLocation()
  const navigate = useNavigate()
  const cartItemIds = location.state?.cartItemIds || []
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    receiver_name: '',
    receiver_phone: '',
    receiver_address: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.receiver_name.trim()) {
      newErrors.receiver_name = 'Name is required'
    }
    if (!formData.receiver_phone.trim()) {
      newErrors.receiver_phone = 'Phone is required'
    }
    if (!formData.receiver_address.trim()) {
      newErrors.receiver_address = 'Address is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const res = await ordersAPI.createOrder({
        ...formData,
        cart_item_ids: cartItemIds,
      })
      setOrderId(res.data.order.id)
      setSuccess(true)
    } catch (error) {
      console.error('Failed to create order:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePay = async () => {
    if (!orderId) return
    setLoading(true)
    try {
      await ordersAPI.payOrder(orderId)
      navigate('/orders')
    } catch (error) {
      console.error('Failed to pay order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (cartItemIds.length === 0 && !success) {
    navigate('/cart')
    return null
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Created!</h2>
          <p className="text-gray-500 mb-6">
            Your order has been created successfully. Would you like to pay now?
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate('/orders')}>
              View Orders
            </Button>
            <Button onClick={handlePay} disabled={loading}>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay Now
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold mb-4">Shipping Information</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="receiver_name">Full Name</Label>
              <Input
                id="receiver_name"
                name="receiver_name"
                value={formData.receiver_name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
              {errors.receiver_name && (
                <p className="text-red-500 text-sm mt-1">{errors.receiver_name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="receiver_phone">Phone Number</Label>
              <Input
                id="receiver_phone"
                name="receiver_phone"
                value={formData.receiver_phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
              {errors.receiver_phone && (
                <p className="text-red-500 text-sm mt-1">{errors.receiver_phone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="receiver_address">Shipping Address</Label>
              <Input
                id="receiver_address"
                name="receiver_address"
                value={formData.receiver_address}
                onChange={handleChange}
                placeholder="Enter your shipping address"
              />
              {errors.receiver_address && (
                <p className="text-red-500 text-sm mt-1">{errors.receiver_address}</p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-500 mb-4">
              This is a demo. No actual payment will be processed.
            </p>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Processing...' : 'Place Order'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
