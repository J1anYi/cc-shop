import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Users, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react'
import { adminAPI } from '@/services/api'

interface DashboardData {
  total_sales: number
  total_orders: number
  total_users: number
  total_products: number
  recent_orders: any[]
  sales_data: { date: string; sales: number }[]
  status_counts: Record<string, number>
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await adminAPI.getDashboard()
      setData(res.data)
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!data) return null

  const statCards = [
    { title: 'Total Sales', value: `$${data.total_sales.toFixed(2)}`, icon: DollarSign, color: 'bg-green-500' },
    { title: 'Total Orders', value: data.total_orders, icon: Package, color: 'bg-blue-500' },
    { title: 'Total Users', value: data.total_users, icon: Users, color: 'bg-purple-500' },
    { title: 'Total Products', value: data.total_products, icon: ShoppingBag, color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Sales (Last 7 Days)
          </h2>
          <div className="h-64 flex items-end gap-2">
            {data.sales_data.map((item) => {
              const maxSales = Math.max(...data.sales_data.map((d) => d.sales))
              const height = maxSales > 0 ? (item.sales / maxSales) * 100 : 0
              return (
                <div key={item.date} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-black rounded-t"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  />
                  <span className="text-xs text-gray-500 mt-2">
                    {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-xs font-medium">${item.sales.toFixed(0)}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold mb-4">Order Status</h2>
          <div className="space-y-3">
            {Object.entries(data.status_counts).map(([status, count]) => {
              const colors: Record<string, string> = {
                pending: 'bg-yellow-500',
                paid: 'bg-blue-500',
                shipped: 'bg-purple-500',
                delivered: 'bg-green-500',
                cancelled: 'bg-red-500',
              }
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colors[status]}`} />
                    <span className="capitalize">{status}</span>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.recent_orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 text-sm">{order.order_no}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 capitalize">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">${order.total_amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
