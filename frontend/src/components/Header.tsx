import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, User, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux'
import { logout } from '@/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { totalItems } = useAppSelector((state) => state.cart)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-wider">
            LUXE
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm hover:text-gray-600 transition">
              Home
            </Link>
            <Link to="/products" className="text-sm hover:text-gray-600 transition">
              Shop
            </Link>
            <Link to="/products?category_id=1" className="text-sm hover:text-gray-600 transition">
              Women
            </Link>
            <Link to="/products?category_id=2" className="text-sm hover:text-gray-600 transition">
              Men
            </Link>
            <Link to="/products?category_id=3" className="text-sm hover:text-gray-600 transition">
              Accessories
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/favorites" className="relative hover:text-gray-600 transition">
                  <Heart className="h-5 w-5" />
                </Link>
                <Link to="/cart" className="relative hover:text-gray-600 transition">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <Link to="/orders" className="hover:text-gray-600 transition">
                  <User className="h-5 w-5" />
                </Link>
                {user?.is_admin && (
                  <Link to="/admin" className="text-sm hover:text-gray-600 transition">
                    Admin
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearch} className="mb-4">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </form>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="py-2 hover:text-gray-600" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/products" className="py-2 hover:text-gray-600" onClick={() => setIsMenuOpen(false)}>
                Shop
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/favorites" className="py-2 hover:text-gray-600" onClick={() => setIsMenuOpen(false)}>
                    Favorites
                  </Link>
                  <Link to="/cart" className="py-2 hover:text-gray-600" onClick={() => setIsMenuOpen(false)}>
                    Cart ({totalItems})
                  </Link>
                  <Link to="/orders" className="py-2 hover:text-gray-600" onClick={() => setIsMenuOpen(false)}>
                    My Orders
                  </Link>
                  {user?.is_admin && (
                    <Link to="/admin" className="py-2 hover:text-gray-600" onClick={() => setIsMenuOpen(false)}>
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="py-2 text-left hover:text-gray-600">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="py-2 hover:text-gray-600" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="py-2 hover:text-gray-600" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
