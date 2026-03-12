from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from sqlalchemy import func
from app.models import db, User, Product, Category, ProductSKU, Order, OrderItem, Banner, Review

admin_bp = Blueprint('admin', __name__)

# Middleware to check admin
def admin_required(fn):
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or not user.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper

# Dashboard Statistics
@admin_bp.route('/statistics/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403

    # Total sales
    total_sales = db.session.query(func.sum(Order.total_amount))\
        .filter(Order.status.in_(['paid', 'shipped', 'delivered'])).scalar() or 0

    # Total orders
    total_orders = Order.query.count()

    # Total users
    total_users = User.query.filter_by(is_admin=False).count()

    # Total products
    total_products = Product.query.filter_by(status='active').count()

    # Recent orders
    recent_orders = Order.query.order_by(Order.created_at.desc()).limit(5).all()

    # Sales by day (last 7 days)
    sales_data = []
    for i in range(6, -1, -1):
        date = datetime.utcnow().date() - timedelta(days=i)
        day_sales = db.session.query(func.sum(Order.total_amount))\
            .filter(
                Order.status.in_(['paid', 'shipped', 'delivered']),
                func.date(Order.created_at) == date
            ).scalar() or 0
        sales_data.append({
            'date': date.isoformat(),
            'sales': float(day_sales)
        })

    # Order status counts
    status_counts = {}
    for status in ['pending', 'paid', 'shipped', 'delivered', 'cancelled']:
        count = Order.query.filter_by(status=status).count()
        status_counts[status] = count

    return jsonify({
        'total_sales': float(total_sales),
        'total_orders': total_orders,
        'total_users': total_users,
        'total_products': total_products,
        'recent_orders': [o.to_dict() for o in recent_orders],
        'sales_data': sales_data,
        'status_counts': status_counts
    }), 200

# ============ Product Management ============

@admin_bp.route('/products', methods=['GET'])
@jwt_required()
def get_admin_products():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403

    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)

    pagination = Product.query.order_by(Product.created_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)

    products = [p.to_dict() for p in pagination.items]

    return jsonify({
        'products': products,
        'total': pagination.total,
        'pages': pagination.pages
    }), 200


@admin_bp.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403

    data = request.get_json()

    product = Product(
        name=data.get('name'),
        description=data.get('description'),
        price=data.get('price'),
        original_price=data.get('original_price'),
        stock=data.get('stock', 0),
        category_id=data.get('category_id'),
        main_image=data.get('main_image'),
        status=data.get('status', 'active')
    )

    if data.get('images'):
        product.set_images(data['images'])

    db.session.add(product)
    db.session.flush()

    # Add SKUs
    if data.get('skus'):
        for sku_data in data['skus']:
            sku = ProductSKU(
                product_id=product.id,
                size=sku_data.get('size'),
                color=sku_data.get('color'),
                stock=sku_data.get('stock', 0),
                price_adjust=sku_data.get('price_adjust', 0)
            )
            db.session.add(sku)

    db.session.commit()

    return jsonify({
        'message': 'Product created successfully',
        'product': product.to_dict()
    }), 201


@admin_bp.route('/products/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403

    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    data = request.get_json()

    for field in ['name', 'description', 'price', 'original_price', 'stock', 'category_id', 'main_image', 'status']:
        if field in data:
            setattr(product, field, data[field])

    if 'images' in data:
        product.set_images(data['images'])

    db.session.commit()

    return jsonify({
        'message': 'Product updated successfully',
        'product': product.to_dict()
    }), 200


@admin_bp.route('/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403

    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    product.status = 'inactive'
    db.session.commit()

    return jsonify({'message': 'Product deleted successfully'}), 200

# ============ Category Management ============

@admin_bp.route('/categories', methods=['GET'])
@jwt_required()
def get_admin_categories():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403

    categories = Category.query.order_by(Category.sort_order).all()
    return jsonify({'categories': [c.to_dict() for c in categories]}), 200


@admin_bp.route('/categories', methods=['POST'])
@jwt_required()
def create_category():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403

    data = request.get_json()

    category = Category(
        name=data.get('name'),
        parent_id=data.get('parent_id'),
        sort_order=data.get('sort_order', 0)
    )

    db.session.add(category)
    db.session.commit()

    return jsonify({
        'message': 'Category created successfully',
        'category': category.to_dict()
    }), 201


@admin_bp.route('/categories/<int:category_id>', methods=['PUT'])
@jwt_required()
def update_category(category_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403

    category = Category.query.get(category_id)
    if not category:
        return jsonify({'error': 'Category not found'}), 404

    data = request.get_json()

    for field in ['name', 'parent_id', 'sort_order']:
        if field in data:
            setattr(category, field, data[field])

    db.session.commit()

    return jsonify({
        'message': 'Category updated successfully',
        'category': category.to_dict()
    }), 200


@admin_bp.route('/categories/<int:category_id>', methods=['DELETE'])
@jwt_required()
def delete_category(category_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403

    category = Category.query.get(category_id)
    if not category:
        return jsonify({'error': 'Category not found'}), 404

    db.session.delete(category)
    db.session.commit()

    return jsonify({'message': 'Category deleted successfully'}), 200

# ============ Order Management ============

@admin_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_admin_orders():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403

    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    status = request.args.get('status')

    query = Order.query
    if status:
        query = query.filter_by(status=status)

    pagination = query.order_by(Order.created_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)

    orders = [o.to_dict() for o in pagination.items]

    return jsonify({
        'orders': orders,
        'total': pagination.total,
        'pages': pagination.pages
    }), 200


@admin_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403

    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    data = request.get_json()
    new_status = data.get('status')

    if new_status not in ['pending', 'paid', 'shipped', 'delivered', 'cancelled']:
        return jsonify({'error': 'Invalid status'}), 400

    order.status = new_status

    if new_status == 'shipped':
        order.shipped_at = datetime.utcnow()
    elif new_status == 'delivered':
        order.delivered_at = datetime.utcnow()

    db.session.commit()

    return jsonify({
        'message': 'Order status updated',
        'order': order.to_dict()
    }), 200

# ============ User Management ============

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_admin_users():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403

    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)

    pagination = User.query.filter_by(is_admin=False)\
        .order_by(User.created_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)

    users = [u.to_dict() for u in pagination.items]

    return jsonify({
        'users': users,
        'total': pagination.total,
        'pages': pagination.pages
    }), 200


@admin_bp.route('/users/<int:user_id>/status', methods=['PUT'])
@jwt_required()
def update_user_status(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    if not current_user or not current_user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    new_status = data.get('status')

    if new_status not in ['active', 'inactive', 'banned']:
        return jsonify({'error': 'Invalid status'}), 400

    user.status = new_status
    db.session.commit()

    return jsonify({
        'message': 'User status updated',
        'user': user.to_dict()
    }), 200
