import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, SortAsc } from 'lucide-react'
import { productsAPI } from '@/services/api'
import { Product, Category } from '@/types'
import ProductCard from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const categoryId = searchParams.get('category_id')
  const keyword = searchParams.get('keyword')
  const sortBy = searchParams.get('sort_by') || 'created_at'
  const order = searchParams.get('order') || 'desc'

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productsAPI.getCategories()
        setCategories(res.data.categories)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await productsAPI.getProducts({
          page,
          per_page: 12,
          category_id: categoryId ? parseInt(categoryId) : undefined,
          keyword: keyword || undefined,
          sort_by: sortBy,
          order,
        })
        setProducts(res.data.products)
        setTotal(res.data.total)
        setTotalPages(res.data.pages)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [page, categoryId, keyword, sortBy, order])

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value === 'all') {
      params.delete('category_id')
    } else {
      params.set('category_id', value)
    }
    setPage(1)
    setSearchParams(params)
  }

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    const [newSortBy, newOrder] = value.split('-')
    params.set('sort_by', newSortBy)
    params.set('order', newOrder)
    setSearchParams(params)
  }

  const getAllSubcategories = (cats: Category[]): Category[] => {
    const result: Category[] = []
    const traverse = (category: Category) => {
      if (category.children && category.children.length > 0) {
        category.children.forEach(traverse)
      } else {
        result.push(category)
      }
    }
    cats.forEach(traverse)
    return result
  }

  const allCategories = getAllSubcategories(categories)
  const currentCategory = categoryId
    ? allCategories.find((c) => c.id === parseInt(categoryId))
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {currentCategory ? currentCategory.name : keyword ? `Search: "${keyword}"` : 'All Products'}
          </h1>
          <p className="text-gray-600">{total} products found</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Category:</span>
            <Select value={categoryId || 'all'} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <SortAsc className="h-4 w-4" />
            <span className="text-sm font-medium">Sort by:</span>
            <Select value={`${sortBy}-${order}`} onValueChange={handleSortChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at-desc">Newest</SelectItem>
                <SelectItem value="created_at-asc">Oldest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="sales-desc">Best Selling</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
              .map((p, i, arr) => (
                <span key={p}>
                  {i > 0 && arr[i - 1] !== p - 1 && <span className="px-2">...</span>}
                  <Button
                    variant={page === p ? 'default' : 'outline'}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                </span>
              ))}
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
