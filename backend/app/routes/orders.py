from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app.models.user import db
from app.models.order import Order, OrderItem
from app.models.cart import CartItem
from app.models.product import Product, ProductSKU

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('', methods=['GET'])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    status = request.args.get('status')

    query = Order.query.filter_by(user_id=user_id)

    if status:
        query = query.filter_by(status=status)

    pagination = query.order_by(Order.created_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)

    orders = [o.to_dict() for o in pagination.items]

    return jsonify({
        'orders': orders,
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    }), 200


@orders_bp.route('', methods=['POST'])
@jwt_required()
def create_order():
    user_id = get_jwt_identity()
    data = request.get_json()

    receiver_name = data.get('receiver_name')
    receiver_phone = data.get('receiver_phone')
    receiver_address = data.get('receiver_address')
    cart_item_ids = data.get('cart_item_ids', [])

    if not all([receiver_name, receiver_phone, receiver_address]):
        return jsonify({'error': 'Receiver information is required'}), 400

    if not cart_item_ids:
        return jsonify({'error': 'No items selected'}), 400

    cart_items = CartItem.query.filter(
        CartItem.id.in_(cart_item_ids),
        CartItem.user_id == user_id
    ).all()

    if not cart_items:
        return jsonify({'error': 'No valid cart items found'}), 400

    # Calculate total and prepare order items
    total_amount = 0
    order_items_data = []

    for item in cart_items:
        product = item.product
        sku = item.sku

        # Calculate price
        base_price = product.price
        if sku:
            price = base_price + (sku.price_adjust or 0)
            sku_info = f"{sku.color} / {sku.size}" if sku.color and sku.size else (sku.color or sku.size)
        else:
            price = base_price
            sku_info = None

        item_total = price * item.quantity
        total_amount += item_total

        order_items_data.append({
            'product_id': product.id,
            'sku_id': sku.id if sku else None,
            'quantity': item.quantity,
            'price': price,
            'product_name': product.name,
            'sku_info': sku_info,
            'product_image': product.main_image
        })

        # Update stock
        if sku:
            sku.stock -= item.quantity
        else:
            product.stock -= item.quantity
        product.sales += item.quantity

    # Create order
    order = Order(
        order_no=Order.generate_order_no(),
        user_id=user_id,
        total_amount=total_amount,
        receiver_name=receiver_name,
        receiver_phone=receiver_phone,
        receiver_address=receiver_address
    )
    db.session.add(order)
    db.session.flush()  # Get order ID

    # Create order items
    for item_data in order_items_data:
        order_item = OrderItem(
            order_id=order.id,
            **item_data
        )
        db.session.add(order_item)

    # Clear cart items
    CartItem.query.filter(CartItem.id.in_(cart_item_ids)).delete(synchronize_session='fetch')

    db.session.commit()

    return jsonify({
        'message': 'Order created successfully',
        'order': order.to_dict()
    }), 201


@orders_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    user_id = get_jwt_identity()

    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    return jsonify({'order': order.to_dict()}), 200


@orders_bp.route('/<int:order_id>/cancel', methods=['PUT'])
@jwt_required()
def cancel_order(order_id):
    user_id = get_jwt_identity()

    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    if order.status != 'pending':
        return jsonify({'error': 'Only pending orders can be cancelled'}), 400

    # Restore stock
    for item in order.items:
        product = Product.query.get(item.product_id)
        if item.sku_id:
            sku = ProductSKU.query.get(item.sku_id)
            if sku:
                sku.stock += item.quantity
        if product:
            product.stock += item.quantity
            product.sales -= item.quantity

    order.status = 'cancelled'
    db.session.commit()

    return jsonify({
        'message': 'Order cancelled successfully',
        'order': order.to_dict()
    }), 200


@orders_bp.route('/<int:order_id>/pay', methods=['POST'])
@jwt_required()
def pay_order(order_id):
    user_id = get_jwt_identity()

    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    if order.status != 'pending':
        return jsonify({'error': 'Order is not pending'}), 400

    # Simulate payment
    order.status = 'paid'
    order.paid_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        'message': 'Payment successful',
        'order': order.to_dict()
    }), 200
