from datetime import datetime
import uuid
from .base import db

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    order_no = db.Column(db.String(50), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, paid, shipped, delivered, cancelled
    receiver_name = db.Column(db.String(100), nullable=False)
    receiver_phone = db.Column(db.String(20), nullable=False)
    receiver_address = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    paid_at = db.Column(db.DateTime)
    shipped_at = db.Column(db.DateTime)
    delivered_at = db.Column(db.DateTime)

    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy='dynamic', cascade='all, delete-orphan')

    @staticmethod
    def generate_order_no():
        return f'LX{datetime.now().strftime("%Y%m%d%H%M%S")}{uuid.uuid4().hex[:6].upper()}'

    def to_dict(self):
        return {
            'id': self.id,
            'order_no': self.order_no,
            'user_id': self.user_id,
            'total_amount': self.total_amount,
            'status': self.status,
            'receiver_name': self.receiver_name,
            'receiver_phone': self.receiver_phone,
            'receiver_address': self.receiver_address,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'paid_at': self.paid_at.isoformat() if self.paid_at else None,
            'shipped_at': self.shipped_at.isoformat() if self.shipped_at else None,
            'delivered_at': self.delivered_at.isoformat() if self.delivered_at else None,
            'items': [item.to_dict() for item in self.items]
        }


class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    sku_id = db.Column(db.Integer, db.ForeignKey('product_skus.id'))
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)  # Price at time of order
    product_name = db.Column(db.String(200), nullable=False)
    sku_info = db.Column(db.String(100))  # e.g., "Black / M"
    product_image = db.Column(db.String(255))

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'sku_id': self.sku_id,
            'quantity': self.quantity,
            'price': self.price,
            'product_name': self.product_name,
            'sku_info': self.sku_info,
            'product_image': self.product_image
        }
