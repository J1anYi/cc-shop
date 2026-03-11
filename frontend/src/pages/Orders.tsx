import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronRight, XCircle, CreditCard } from 'lucide-react'
import { ordersAPI } from '@/services/api'
import { Order } from '@/types'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

const statusLabels: Record<string, string> = {
  pending: 'Pending Payment',
  paid: 'Paid',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await ordersAPI.getOrders()
      setOrders(res.data.orders)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async (orderId: number) => {
    try {
      await ordersAPI.cancelOrder(orderId)
      fetchOrders()
      setSelectedOrder(null)
    } catch (error) {
      console.error('Failed to cancel order:', error)
    }
  }

  const handlePayOrder = async (orderId: number) => {
    try {
      await ordersAPI.payOrder(orderId)
      fetchOrders()
    } catch (error) {
      console.error('Failed to pay order:', error)
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'all') return true
    return order.status === activeTab
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg">
                <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-bold mb-2">No orders found</h2>
                <p className="text-gray-500 mb-4">Start shopping to place your first order</p>
                <Link to="/products">
                  <Button>Shop Now</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="p-4 border-b flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-500">Order #{order.order_no}</span>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          statusColors[order.status]
                        }`}
                      >
                        {statusLabels[order.status]}
                      </span>
                    </div>
                    <div className="p-4">
                      <div className="flex gap-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <img
                            key={index}
                            src={item.product_image || '/placeholder.jpg'}
                            alt={item.product_name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="font-bold">${order.total_amount.toFixed(2)}</span>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.order_no}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-sm ${statusColors[selectedOrder.status]}`}>
                  {statusLabels[selectedOrder.status]}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(selectedOrder.created_at).toLocaleString()}
                </span>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Shipping Address</h4>
                <p className="text-sm text-gray-600">
                  {selectedOrder.receiver_name}<br />
                  {selectedOrder.receiver_phone}<br />
                  {selectedOrder.receiver_address}
                </p>
              </div>

              <div className="border rounded-lg divide-y">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="p-4 flex gap-4">
                    <img
                      src={item.product_image || '/placeholder.jpg'}
                      alt={item.product_name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.product_name}</p>
                      {item.sku_info && (
                        <p className="text-sm text-gray-500">{item.sku_info}</p>
                      )}
                      <div className="flex justify-between mt-2">
                        <span className="text-sm text-gray-500">x{item.quantity}</span>
                        <span className="font-medium">${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${selectedOrder.total_amount.toFixed(2)}</span>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            {selectedOrder?.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Order
                </Button>
                <Button onClick={() => handlePayOrder(selectedOrder.id)}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Now
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
