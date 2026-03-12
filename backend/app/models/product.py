from datetime import datetime
import json
from .base import db

class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Self-referential relationship for subcategories
    children = db.relationship('Category', backref=db.backref('parent', remote_side=[id]), lazy='dynamic')
    products = db.relationship('Product', backref='category', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'parent_id': self.parent_id,
            'sort_order': self.sort_order,
            'children': [child.to_dict() for child in self.children] if self.children else []
        }


class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    original_price = db.Column(db.Float)
    stock = db.Column(db.Integer, default=0)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    main_image = db.Column(db.String(255))
    images = db.Column(db.Text)  # JSON string of image URLs
    status = db.Column(db.String(20), default='active')  # active, inactive
    sales = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    skus = db.relationship('ProductSKU', backref='product', lazy='dynamic', cascade='all, delete-orphan')

    def get_images(self):
        if self.images:
            try:
                return json.loads(self.images)
            except:
                return []
        return []

    def set_images(self, images_list):
        self.images = json.dumps(images_list)

    def to_dict(self, include_skus=True):
        data = {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'original_price': self.original_price,
            'stock': self.stock,
            'category_id': self.category_id,
            'main_image': self.main_image,
            'images': self.get_images(),
            'status': self.status,
            'sales': self.sales,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        if include_skus:
            data['skus'] = [sku.to_dict() for sku in self.skus]
        return data


class ProductSKU(db.Model):
    __tablename__ = 'product_skus'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    size = db.Column(db.String(20))
    color = db.Column(db.String(50))
    stock = db.Column(db.Integer, default=0)
    price_adjust = db.Column(db.Float, default=0)  # Price adjustment from base price

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'size': self.size,
            'color': self.color,
            'stock': self.stock,
            'price_adjust': self.price_adjust
        }
