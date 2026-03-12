from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, Banner, User

banners_bp = Blueprint('banners', __name__)

@banners_bp.route('', methods=['GET'])
def get_banners():
    banners = Banner.query.filter_by(status='active')\
        .order_by(Banner.sort_order).all()

    return jsonify({
        'banners': [b.to_dict() for b in banners]
    }), 200


@banners_bp.route('', methods=['POST'])
@jwt_required()
def create_banner():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403

    data = request.get_json()

    banner = Banner(
        title=data.get('title'),
        image_url=data.get('image_url'),
        link_url=data.get('link_url'),
        sort_order=data.get('sort_order', 0),
        status=data.get('status', 'active')
    )

    db.session.add(banner)
    db.session.commit()

    return jsonify({
        'message': 'Banner created successfully',
        'banner': banner.to_dict()
    }), 201


@banners_bp.route('/<int:banner_id>', methods=['PUT'])
@jwt_required()
def update_banner(banner_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403

    banner = Banner.query.get(banner_id)
    if not banner:
        return jsonify({'error': 'Banner not found'}), 404

    data = request.get_json()

    for field in ['title', 'image_url', 'link_url', 'sort_order', 'status']:
        if field in data:
            setattr(banner, field, data[field])

    db.session.commit()

    return jsonify({
        'message': 'Banner updated successfully',
        'banner': banner.to_dict()
    }), 200


@banners_bp.route('/<int:banner_id>', methods=['DELETE'])
@jwt_required()
def delete_banner(banner_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403

    banner = Banner.query.get(banner_id)
    if not banner:
        return jsonify({'error': 'Banner not found'}), 404

    db.session.delete(banner)
    db.session.commit()

    return jsonify({'message': 'Banner deleted successfully'}), 200
