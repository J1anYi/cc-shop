import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold tracking-wider mb-4">LUXE</h3>
            <p className="text-sm text-gray-600">
              Premium fashion for the modern lifestyle. Discover timeless pieces crafted with quality and style.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/products?category_id=1" className="hover:text-black transition">
                  Women
                </Link>
              </li>
              <li>
                <Link to="/products?category_id=2" className="hover:text-black transition">
                  Men
                </Link>
              </li>
              <li>
                <Link to="/products?category_id=3" className="hover:text-black transition">
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-black transition">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-black transition">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-black transition">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Newsletter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} LUXE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
