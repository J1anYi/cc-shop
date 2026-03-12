from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, CartItem, Product, ProductSKU

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    cart_items = CartItem.query.filter_by(user_id=user_id).all()

    return jsonify({
        'cart_items': [item.to_dict() for item in cart_items]
    }), 200


@cart_bp.route('', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()

    product_id = data.get('product_id')
    sku_id = data.get('sku_id')
    quantity = data.get('quantity', 1)

    if not product_id:
        return jsonify({'error': 'Product ID is required'}), 400

    product = Product.query.get(product_id)
    if not product or product.status != 'active':
        return jsonify({'error': 'Product not available'}), 404

    # Check if SKU exists and has stock
    if sku_id:
        sku = ProductSKU.query.get(sku_id)
        if not sku or sku.product_id != product_id:
            return jsonify({'error': 'Invalid SKU'}), 400
        if sku.stock < quantity:
            return jsonify({'error': 'Insufficient stock'}), 400
    else:
        if product.stock < quantity:
            return jsonify({'error': 'Insufficient stock'}), 400

    # Check if item already exists in cart
    existing = CartItem.query.filter_by(
        user_id=user_id,
        product_id=product_id,
        sku_id=sku_id
    ).first()

    if existing:
        existing.quantity += quantity
    else:
        cart_item = CartItem(
            user_id=user_id,
            product_id=product_id,
            sku_id=sku_id,
            quantity=quantity
        )
        db.session.add(cart_item)

    db.session.commit()

    return jsonify({'message': 'Added to cart successfully'}), 200


@cart_bp.route('/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(item_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    quantity = data.get('quantity')
    if not quantity or quantity < 1:
        return jsonify({'error': 'Valid quantity is required'}), 400

    cart_item = CartItem.query.filter_by(id=item_id, user_id=user_id).first()
    if not cart_item:
        return jsonify({'error': 'Cart item not found'}), 404

    # Check stock
    if cart_item.sku_id:
        sku = ProductSKU.query.get(cart_item.sku_id)
        if sku.stock < quantity:
            return jsonify({'error': 'Insufficient stock'}), 400
    else:
        product = Product.query.get(cart_item.product_id)
        if product.stock < quantity:
            return jsonify({'error': 'Insufficient stock'}), 400

    cart_item.quantity = quantity
    db.session.commit()

    return jsonify({'message': 'Cart updated successfully'}), 200


@cart_bp.route('/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_cart_item(item_id):
    user_id = get_jwt_identity()

    cart_item = CartItem.query.filter_by(id=item_id, user_id=user_id).first()
    if not cart_item:
        return jsonify({'error': 'Cart item not found'}), 404

    db.session.delete(cart_item)
    db.session.commit()

    return jsonify({'message': 'Item removed from cart'}), 200


@cart_bp.route('/clear', methods=['DELETE'])
@jwt_required()
def clear_cart():
    user_id = get_jwt_identity()

    CartItem.query.filter_by(user_id=user_id).delete()
    db.session.commit()

    return jsonify({'message': 'Cart cleared'}), 200
