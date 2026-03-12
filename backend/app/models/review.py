from datetime import datetime
import json
from .base import db

class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5
    content = db.Column(db.Text)
    images = db.Column(db.Text)  # JSON string of image URLs
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def get_images(self):
        if self.images:
            try:
                return json.loads(self.images)
            except:
                return []
        return []

    def set_images(self, images_list):
        self.images = json.dumps(images_list)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user': {
                'id': self.user.id,
                'username': self.user.username,
                'avatar': self.user.avatar
            } if self.user else None,
            'product_id': self.product_id,
            'rating': self.rating,
            'content': self.content,
            'images': self.get_images(),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
