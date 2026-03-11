from flask import Blueprint, request, jsonify
from app.models.user import db
from app.models.product import Product, Category, ProductSKU
from app.models.review import Review

products_bp = Blueprint('products', __name__)

@products_bp.route('', methods=['GET'])
def get_products():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)
    category_id = request.args.get('category_id', type=int)
    keyword = request.args.get('keyword', '')
    sort_by = request.args.get('sort_by', 'created_at')  # created_at, price, sales
    order = request.args.get('order', 'desc')  # asc, desc
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)

    query = Product.query.filter_by(status='active')

    if category_id:
        query = query.filter_by(category_id=category_id)

    if keyword:
        query = query.filter(Product.name.ilike(f'%{keyword}%'))

    if min_price is not None:
        query = query.filter(Product.price >= min_price)

    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    # Sorting
    sort_column = getattr(Product, sort_by, Product.created_at)
    if order == 'asc':
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    products = [p.to_dict(include_skus=True) for p in pagination.items]

    return jsonify({
        'products': products,
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    }), 200


@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get(product_id)

    if not product:
        return jsonify({'error': 'Product not found'}), 404

    return jsonify({'product': product.to_dict(include_skus=True)}), 200


@products_bp.route('/<int:product_id>/reviews', methods=['GET'])
def get_product_reviews(product_id):
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    pagination = Review.query.filter_by(product_id=product_id)\
        .order_by(Review.created_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)

    reviews = [r.to_dict() for r in pagination.items]

    # Calculate average rating
    all_reviews = Review.query.filter_by(product_id=product_id).all()
    avg_rating = sum(r.rating for r in all_reviews) / len(all_reviews) if all_reviews else 0

    return jsonify({
        'reviews': reviews,
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page,
        'average_rating': round(avg_rating, 1)
    }), 200


@products_bp.route('/categories', methods=['GET'])
def get_categories():
    # Get top-level categories
    categories = Category.query.filter_by(parent_id=None).order_by(Category.sort_order).all()
    return jsonify({
        'categories': [c.to_dict() for c in categories]
    }), 200


@products_bp.route('/categories/<int:category_id>', methods=['GET'])
def get_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    return jsonify({'category': category.to_dict()}), 200
