from app.models.user import db, User
from app.models.product import Product, Category, ProductSKU
from app.models.banner import Banner

def seed_data():
    """Seed initial data for the database"""

    # Check if data already exists
    if User.query.first():
        return

    # Create admin user
    admin = User(username='admin', email='admin@luxe.com', is_admin=True)
    admin.set_password('admin123')
    db.session.add(admin)

    # Create test user
    test_user = User(username='test', email='test@luxe.com', phone='13800138000')
    test_user.set_password('test123')
    db.session.add(test_user)

    # Create categories
    categories_data = [
        {'name': 'Women', 'sort_order': 1},
        {'name': 'Men', 'sort_order': 2},
        {'name': 'Accessories', 'sort_order': 3},
    ]

    categories = []
    for cat_data in categories_data:
        cat = Category(**cat_data)
        db.session.add(cat)
        categories.append(cat)

    db.session.flush()

    # Create subcategories
    subcategories_data = [
        {'name': 'Dresses', 'parent_id': categories[0].id, 'sort_order': 1},
        {'name': 'Tops', 'parent_id': categories[0].id, 'sort_order': 2},
        {'name': 'Pants', 'parent_id': categories[0].id, 'sort_order': 3},
        {'name': 'T-Shirts', 'parent_id': categories[1].id, 'sort_order': 1},
        {'name': 'Jackets', 'parent_id': categories[1].id, 'sort_order': 2},
        {'name': 'Bags', 'parent_id': categories[2].id, 'sort_order': 1},
        {'name': 'Jewelry', 'parent_id': categories[2].id, 'sort_order': 2},
    ]

    for subcat_data in subcategories_data:
        subcat = Category(**subcat_data)
        db.session.add(subcat)

    db.session.flush()

    # Create products
    products_data = [
        {
            'name': 'Elegant Silk Dress',
            'description': 'Luxurious silk dress perfect for evening occasions. Features a flattering A-line silhouette and delicate details.',
            'price': 299.00,
            'original_price': 399.00,
            'stock': 50,
            'category_id': categories[0].id,
            'main_image': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
            'images': [
                'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
                'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800'
            ],
            'skus': [
                {'size': 'S', 'color': 'Black', 'stock': 15},
                {'size': 'M', 'color': 'Black', 'stock': 20},
                {'size': 'L', 'color': 'Black', 'stock': 15},
                {'size': 'S', 'color': 'Navy', 'stock': 10},
                {'size': 'M', 'color': 'Navy', 'stock': 15},
            ]
        },
        {
            'name': 'Casual Linen Blouse',
            'description': 'Breathable linen blouse with a relaxed fit. Perfect for warm weather styling.',
            'price': 89.00,
            'original_price': 129.00,
            'stock': 100,
            'category_id': categories[0].id,
            'main_image': 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800',
            'images': [
                'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800'
            ],
            'skus': [
                {'size': 'XS', 'color': 'White', 'stock': 25},
                {'size': 'S', 'color': 'White', 'stock': 30},
                {'size': 'M', 'color': 'White', 'stock': 25},
                {'size': 'L', 'color': 'White', 'stock': 20},
            ]
        },
        {
            'name': 'Classic Wool Coat',
            'description': 'Timeless wool coat with a tailored fit. A wardrobe essential for the modern woman.',
            'price': 459.00,
            'original_price': None,
            'stock': 30,
            'category_id': categories[0].id,
            'main_image': 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800',
            'images': [
                'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800'
            ],
            'skus': [
                {'size': 'S', 'color': 'Camel', 'stock': 10},
                {'size': 'M', 'color': 'Camel', 'stock': 12},
                {'size': 'L', 'color': 'Camel', 'stock': 8},
            ]
        },
        {
            'name': 'Premium Cotton T-Shirt',
            'description': 'Superior quality cotton t-shirt with a comfortable fit. A versatile piece for everyday wear.',
            'price': 59.00,
            'original_price': 79.00,
            'stock': 200,
            'category_id': categories[1].id,
            'main_image': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
            'images': [
                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'
            ],
            'skus': [
                {'size': 'S', 'color': 'White', 'stock': 50},
                {'size': 'M', 'color': 'White', 'stock': 50},
                {'size': 'L', 'color': 'White', 'stock': 50},
                {'size': 'S', 'color': 'Black', 'stock': 25},
                {'size': 'M', 'color': 'Black', 'stock': 25},
            ]
        },
        {
            'name': 'Leather Biker Jacket',
            'description': 'Genuine leather jacket with classic biker styling. Features multiple pockets and asymmetrical zipper.',
            'price': 399.00,
            'original_price': 549.00,
            'stock': 25,
            'category_id': categories[1].id,
            'main_image': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
            'images': [
                'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'
            ],
            'skus': [
                {'size': 'S', 'color': 'Black', 'stock': 8},
                {'size': 'M', 'color': 'Black', 'stock': 10},
                {'size': 'L', 'color': 'Black', 'stock': 7},
            ]
        },
        {
            'name': 'Tailored Wool Trousers',
            'description': 'Elegant wool trousers with a tailored fit. Perfect for office or formal occasions.',
            'price': 189.00,
            'original_price': None,
            'stock': 60,
            'category_id': categories[1].id,
            'main_image': 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
            'images': [
                'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'
            ],
            'skus': [
                {'size': '30', 'color': 'Charcoal', 'stock': 15},
                {'size': '32', 'color': 'Charcoal', 'stock': 20},
                {'size': '34', 'color': 'Charcoal', 'stock': 15},
                {'size': '36', 'color': 'Charcoal', 'stock': 10},
            ]
        },
        {
            'name': 'Leather Crossbody Bag',
            'description': 'Elegant leather crossbody bag with adjustable strap. Perfect size for daily essentials.',
            'price': 259.00,
            'original_price': 329.00,
            'stock': 40,
            'category_id': categories[2].id,
            'main_image': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
            'images': [
                'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'
            ],
            'skus': [
                {'size': 'One Size', 'color': 'Black', 'stock': 20},
                {'size': 'One Size', 'color': 'Tan', 'stock': 20},
            ]
        },
        {
            'name': 'Gold Pendant Necklace',
            'description': 'Delicate gold-plated pendant necklace. A timeless piece that adds elegance to any outfit.',
            'price': 79.00,
            'original_price': None,
            'stock': 80,
            'category_id': categories[2].id,
            'main_image': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
            'images': [
                'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'
            ],
            'skus': [
                {'size': 'One Size', 'color': 'Gold', 'stock': 80},
            ]
        },
    ]

    for product_data in products_data:
        skus_data = product_data.pop('skus', [])
        product = Product(**product_data)
        db.session.add(product)
        db.session.flush()

        for sku_data in skus_data:
            sku = ProductSKU(product_id=product.id, **sku_data)
            db.session.add(sku)

    # Create banners
    banners_data = [
        {
            'title': 'Spring Collection 2024',
            'image_url': 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920',
            'link_url': '/products?category_id=1',
            'sort_order': 1
        },
        {
            'title': 'New Arrivals',
            'image_url': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920',
            'link_url': '/products',
            'sort_order': 2
        },
        {
            'title': 'Premium Quality',
            'image_url': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920',
            'link_url': '/products',
            'sort_order': 3
        },
    ]

    for banner_data in banners_data:
        banner = Banner(**banner_data)
        db.session.add(banner)

    db.session.commit()
    print("Database seeded successfully!")
