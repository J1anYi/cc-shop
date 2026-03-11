from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import db
from app.models.favorite import Favorite
from app.models.product import Product

favorites_bp = Blueprint('favorites', __name__)

@favorites_bp.route('', methods=['GET'])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)

    pagination = Favorite.query.filter_by(user_id=user_id)\
        .order_by(Favorite.created_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)

    favorites = [f.to_dict() for f in pagination.items]

    return jsonify({
        'favorites': favorites,
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    }), 200


@favorites_bp.route('', methods=['POST'])
@jwt_required()
def add_favorite():
    user_id = get_jwt_identity()
    data = request.get_json()

    product_id = data.get('product_id')
    if not product_id:
        return jsonify({'error': 'Product ID is required'}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    existing = Favorite.query.filter_by(user_id=user_id, product_id=product_id).first()
    if existing:
        return jsonify({'message': 'Already in favorites'}), 200

    favorite = Favorite(user_id=user_id, product_id=product_id)
    db.session.add(favorite)
    db.session.commit()

    return jsonify({'message': 'Added to favorites'}), 201


@favorites_bp.route('/<int:product_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite(product_id):
    user_id = get_jwt_identity()

    favorite = Favorite.query.filter_by(user_id=user_id, product_id=product_id).first()
    if not favorite:
        return jsonify({'error': 'Favorite not found'}), 404

    db.session.delete(favorite)
    db.session.commit()

    return jsonify({'message': 'Removed from favorites'}), 200


@favorites_bp.route('/check/<int:product_id>', methods=['GET'])
@jwt_required()
def check_favorite(product_id):
    user_id = get_jwt_identity()

    favorite = Favorite.query.filter_by(user_id=user_id, product_id=product_id).first()

    return jsonify({'is_favorite': favorite is not None}), 200
