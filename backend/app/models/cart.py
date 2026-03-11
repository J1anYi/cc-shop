from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class CartItem(db.Model):
    __tablename__ = 'cart_items'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    sku_id = db.Column(db.Integer, db.ForeignKey('product_skus.id'))
    quantity = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    product = db.relationship('Product', backref='cart_items')
    sku = db.relationship('ProductSKU', backref='cart_items')

    def to_dict(self):
        sku_data = self.sku.to_dict() if self.sku else None
        return {
            'id': self.id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'product': self.product.to_dict() if self.product else None,
            'sku_id': self.sku_id,
            'sku': sku_data,
            'quantity': self.quantity,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
