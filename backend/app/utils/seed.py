from app.models import db, User, Product, Category, ProductSKU, Banner

def seed_data():
    """Seed initial data for the database"""

    # Clear all existing data
    db.session.query(Banner).delete()
    db.session.query(ProductSKU).delete()
    db.session.query(Product).delete()
    db.session.query(Category).delete()
    db.session.query(User).delete()
    db.session.commit()

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
        {'name': 'Outerwear', 'parent_id': categories[0].id, 'sort_order': 4},
        {'name': 'T-Shirts', 'parent_id': categories[1].id, 'sort_order': 1},
        {'name': 'Shirts', 'parent_id': categories[1].id, 'sort_order': 2},
        {'name': 'Jackets', 'parent_id': categories[1].id, 'sort_order': 3},
        {'name': 'Pants', 'parent_id': categories[1].id, 'sort_order': 4},
        {'name': 'Bags', 'parent_id': categories[2].id, 'sort_order': 1},
        {'name': 'Jewelry', 'parent_id': categories[2].id, 'sort_order': 2},
        {'name': 'Watches', 'parent_id': categories[2].id, 'sort_order': 3},
        {'name': 'Sunglasses', 'parent_id': categories[2].id, 'sort_order': 4},
    ]

    for subcat_data in subcategories_data:
        subcat = Category(**subcat_data)
        db.session.add(subcat)

    db.session.flush()

    # Women's Products
    women_products = [
        {
            'name': 'Elegant Silk Evening Dress',
            'description': 'Luxurious silk dress perfect for evening occasions. Features a flattering A-line silhouette with delicate pleats.',
            'price': 389.00,
            'original_price': 499.00,
            'stock': 50,
            'category_id': categories[0].id,
            'main_image': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
            'images_list': [
                'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
            ],
            'skus': [
                {'size': 'S', 'color': 'Black', 'stock': 15},
                {'size': 'M', 'color': 'Black', 'stock': 20},
                {'size': 'L', 'color': 'Black', 'stock': 10},
                {'size': 'S', 'color': 'Navy', 'stock': 12},
            ]
        },
        {
            'name': 'Floral Summer Maxi Dress',
            'description': 'Beautiful floral print maxi dress, perfect for summer days. Lightweight fabric with a flowy fit.',
            'price': 159.00,
            'original_price': 199.00,
            'stock': 80,
            'category_id': categories[0].id,
            'main_image': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
            'images_list': [
                'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
            ],
            'skus': [
                {'size': 'XS', 'color': 'Floral Blue', 'stock': 20},
                {'size': 'S', 'color': 'Floral Blue', 'stock': 25},
                {'size': 'M', 'color': 'Floral Blue', 'stock': 20},
                {'size': 'L', 'color': 'Floral Pink', 'stock': 15},
            ]
        },
        {
            'name': 'Casual Linen Blouse',
            'description': 'Breathable linen blouse with a relaxed fit. Perfect for warm weather styling.',
            'price': 89.00,
            'original_price': 129.00,
            'stock': 100,
            'category_id': categories[0].id,
            'main_image': 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80',
            'images_list': [
                'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80',
            ],
            'skus': [
                {'size': 'XS', 'color': 'White', 'stock': 25},
                {'size': 'S', 'color': 'White', 'stock': 30},
                {'size': 'M', 'color': 'White', 'stock': 25},
                {'size': 'S', 'color': 'Beige', 'stock': 20},
            ]
        },
        {
            'name': 'Classic Wool Coat',
            'description': 'Timeless wool coat with a tailored fit. A wardrobe essential for the modern woman.',
            'price': 459.00,
            'original_price': None,
            'stock': 30,
            'category_id': categories[0].id,
            'main_image': 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&q=80',
            'images_list': [
                'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&q=80',
            ],
            'skus': [
                {'size': 'S', 'color': 'Camel', 'stock': 10},
                {'size': 'M', 'color': 'Camel', 'stock': 12},
                {'size': 'L', 'color': 'Camel', 'stock': 8},
            ]
        },
        {
            'name': 'High-Waisted Wide Leg Pants',
            'description': 'Elegant high-waisted pants with a wide leg silhouette. Comfortable and stylish.',
            'price': 129.00,
            'original_price': 169.00,
            'stock': 60,
            'category_id': categories[0].id,
            'main_image': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80',
            'images_list': [
                'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80',
            ],
            'skus': [
                {'size': 'S', 'color': 'Black', 'stock': 15},
                {'size': 'M', 'color': 'Black', 'stock': 20},
                {'size': 'L', 'color': 'Black', 'stock': 15},
                {'size': 'M', 'color': 'Beige', 'stock': 10},
            ]
        },
        {
            'name': 'Oversized Knit Sweater',
            'description': 'Cozy oversized knit sweater. Perfect for layering in colder months.',
            'price': 119.00,
            'original_price': None,
            'stock': 70,
            'category_id': categories[0].id,
            'main_image': 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
            'images_list': [
                'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
            ],
            'skus': [
                {'size': 'S/M', 'color': 'Cream', 'stock': 25},
                {'size': 'L/XL', 'color': 'Cream', 'stock': 20},
                {'size': 'S/M', 'color': 'Grey', 'stock': 15},
                {'size': 'L/XL', 'color': 'Grey', 'stock': 10},
            ]
        },
    ]

    # Men's Products
    men_products = [
        {
            'name': 'Premium Cotton T-Shirt',
            'description': 'Superior quality cotton t-shirt with a comfortable fit. A versatile piece for everyday wear.',
            'price': 59.00,
            'original_price': 79.00,
            'stock': 200,
            'category_id': categories[1].id,
            'main_image': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
            'images_list': [
                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
            ],
            'skus': [
                {'size': 'S', 'color': 'White', 'stock': 50},
                {'size': 'M', 'color': 'White', 'stock': 50},
                {'size': 'L', 'color': 'White', 'stock': 50},
                {'size': 'M', 'color': 'Black', 'stock': 25},
                {'size': 'L', 'color': 'Black', 'stock': 25},
            ]
        },
        {
            'name': 'Leather Biker Jacket',
            'description': 'Genuine leather jacket with classic biker styling. Features multiple pockets and asymmetrical zipper.',
            'price': 399.00,
            'original_price': 549.00,
            'stock': 25,
            'category_id': categories[1].id,
            'main_image': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
            'images_list': [
                'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
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
            'main_image': 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
            'images_list': [
                'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
            ],
            'skus': [
                {'size': '30', 'color': 'Charcoal', 'stock': 15},
                {'size': '32', 'color': 'Charcoal', 'stock': 20},
                {'size': '34', 'color': 'Charcoal', 'stock': 15},
                {'size': '36', 'color': 'Charcoal', 'stock': 10},
            ]
        },
        {
            'name': 'Classic Oxford Shirt',
            'description': 'Timeless oxford shirt made from premium cotton. A staple for any wardrobe.',
            'price': 89.00,
            'original_price': 119.00,
            'stock': 120,
            'category_id': categories[1].id,
            'main_image': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
            'images_list': [
                'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
            ],
            'skus': [
                {'size': 'S', 'color': 'White', 'stock': 30},
                {'size': 'M', 'color': 'White', 'stock': 35},
                {'size': 'L', 'color': 'White', 'stock': 30},
                {'size': 'M', 'color': 'Light Blue', 'stock': 25},
            ]
        },
        {
            'name': 'Slim Fit Denim Jeans',
            'description': 'Modern slim fit jeans with stretch comfort. Classic 5-pocket styling.',
            'price': 129.00,
            'original_price': None,
            'stock': 150,
            'category_id': categories[1].id,
            'main_image': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
            'images_list': [
                'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
            ],
            'skus': [
                {'size': '30', 'color': 'Dark Blue', 'stock': 30},
                {'size': '32', 'color': 'Dark Blue', 'stock': 40},
                {'size': '34', 'color': 'Dark Blue', 'stock': 35},
                {'size': '32', 'color': 'Black', 'stock': 25},
                {'size': '34', 'color': 'Black', 'stock': 20},
            ]
        },
        {
            'name': 'Cashmere Pullover',
            'description': 'Luxuriously soft cashmere pullover. Lightweight yet incredibly warm.',
            'price': 249.00,
            'original_price': 329.00,
            'stock': 40,
            'category_id': categories[1].id,
            'main_image': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',
            'images_list': [
                'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',
            ],
            'skus': [
                {'size': 'S', 'color': 'Navy', 'stock': 12},
                {'size': 'M', 'color': 'Navy', 'stock': 15},
                {'size': 'L', 'color': 'Navy', 'stock': 8},
                {'size': 'M', 'color': 'Grey', 'stock': 5},
            ]
        },
    ]

    # Accessories Products
    accessories_products = [
        {
            'name': 'Leather Crossbody Bag',
            'description': 'Elegant leather crossbody bag with adjustable strap. Perfect size for daily essentials.',
            'price': 259.00,
            'original_price': 329.00,
            'stock': 40,
            'category_id': categories[2].id,
            'main_image': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
            'images_list': [
                'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
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
            'main_image': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
            'images_list': [
                'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
            ],
            'skus': [
                {'size': 'One Size', 'color': 'Gold', 'stock': 80},
            ]
        },
        {
            'name': 'Classic Aviator Sunglasses',
            'description': 'Timeless aviator sunglasses with UV protection. A must-have accessory.',
            'price': 149.00,
            'original_price': 199.00,
            'stock': 60,
            'category_id': categories[2].id,
            'main_image': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
            'images_list': [
                'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
            ],
            'skus': [
                {'size': 'One Size', 'color': 'Gold/Green', 'stock': 30},
                {'size': 'One Size', 'color': 'Black/Grey', 'stock': 30},
            ]
        },
        {
            'name': 'Luxury Automatic Watch',
            'description': 'Elegant automatic watch with sapphire crystal. Water resistant to 50m.',
            'price': 499.00,
            'original_price': None,
            'stock': 25,
            'category_id': categories[2].id,
            'main_image': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
            'images_list': [
                'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
            ],
            'skus': [
                {'size': 'One Size', 'color': 'Silver', 'stock': 15},
                {'size': 'One Size', 'color': 'Gold', 'stock': 10},
            ]
        },
        {
            'name': 'Woven Leather Belt',
            'description': 'Handcrafted woven leather belt. Adds sophistication to any outfit.',
            'price': 89.00,
            'original_price': None,
            'stock': 50,
            'category_id': categories[2].id,
            'main_image': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
            'images_list': [
                'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
            ],
            'skus': [
                {'size': 'S', 'color': 'Brown', 'stock': 15},
                {'size': 'M', 'color': 'Brown', 'stock': 20},
                {'size': 'L', 'color': 'Brown', 'stock': 15},
            ]
        },
        {
            'name': 'Silk Scarf',
            'description': 'Luxurious silk scarf with beautiful print. Versatile styling options.',
            'price': 129.00,
            'original_price': 169.00,
            'stock': 45,
            'category_id': categories[2].id,
            'main_image': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
            'images_list': [
                'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
            ],
            'skus': [
                {'size': 'One Size', 'color': 'Floral Blue', 'stock': 20},
                {'size': 'One Size', 'color': 'Floral Pink', 'stock': 15},
                {'size': 'One Size', 'color': 'Geometric', 'stock': 10},
            ]
        },
    ]

    # Add all products
    all_products = women_products + men_products + accessories_products
    for product_data in all_products:
        skus_data = product_data.pop('skus', [])
        images_list = product_data.pop('images_list', [])
        product = Product(**product_data)
        if images_list:
            product.set_images(images_list)
        db.session.add(product)
        db.session.flush()

        for sku_data in skus_data:
            sku = ProductSKU(product_id=product.id, **sku_data)
            db.session.add(sku)

    # Create banners
    banners_data = [
        {
            'title': 'Spring Collection 2024',
            'image_url': 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80',
            'link_url': '/products',
            'sort_order': 1
        },
        {
            'title': 'New Season Arrivals',
            'image_url': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80',
            'link_url': '/products',
            'sort_order': 2
        },
        {
            'title': 'Premium Quality Fashion',
            'image_url': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80',
            'link_url': '/products',
            'sort_order': 3
        },
        {
            'title': 'Summer Sale Up to 50% Off',
            'image_url': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80',
            'link_url': '/products',
            'sort_order': 4
        },
    ]

    for banner_data in banners_data:
        banner = Banner(**banner_data)
        db.session.add(banner)

    db.session.commit()
    print(f"Database seeded successfully! Added {len(all_products)} products and {len(banners_data)} banners.")
