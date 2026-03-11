# LUXE - Premium Fashion Store

A modern, minimalist fashion e-commerce platform built with React and Flask.

## Features

### User Features
- 🏠 Homepage with large hero banners
- 🛍️ Product browsing with filtering and search
- 📱 Responsive design for all devices
- 🛒 Shopping cart management
- ❤️ Product favorites/wishlist
- 📦 Order management
- 👤 User authentication

### Admin Features
- 📊 Dashboard with sales statistics
- 📦 Product management (CRUD)
- 🏷️ Category management
- 📋 Order management
- 👥 User management

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Redux Toolkit
- React Router v6
- Axios

### Backend
- Flask
- Flask-SQLAlchemy
- Flask-JWT-Extended
- SQLite
- Flask-CORS

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python run.py
```

The API will be available at http://localhost:5000

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at http://localhost:5173

## Demo Accounts

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| User | test | test123 |

## API Endpoints

### Public
- `GET /api/banners` - Get banners
- `GET /api/products/categories` - Get categories
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product details

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile

### User (Authenticated)
- Cart: `GET/POST/PUT/DELETE /api/cart`
- Favorites: `GET/POST/DELETE /api/favorites`
- Orders: `GET/POST /api/orders`

### Admin
- Dashboard: `GET /api/admin/statistics/dashboard`
- Products: `GET/POST/PUT/DELETE /api/admin/products`
- Orders: `GET /api/admin/orders`
- Users: `GET /api/admin/users`

## Project Structure

```
luxe-shop/
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── hooks/           # Custom hooks
│   └── ...
│
├── backend/                 # Flask backend
│   ├── app/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   └── utils/           # Utilities
│   └── run.py
│
└── README.md
```

## License

This is a demo/learning project. Feel free to use it for educational purposes.
