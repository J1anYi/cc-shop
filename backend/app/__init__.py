from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.config import Config
from app.models import db
import json

jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Ensure JWT identity is string
    app.config['JWT_JSON_KEY'] = 'sub'
    app.config['JWT_DECODE_LEEWAY'] = 10

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # JWT callbacks to handle string identity
    @jwt.user_identity_loader
    def user_identity_lookup(user):
        return str(user)

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        identity = jwt_data["sub"]
        from app.models import User
        return User.query.get(int(identity))

    # Create upload folder if not exists
    import os
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.products import products_bp
    from app.routes.cart import cart_bp
    from app.routes.favorites import favorites_bp
    from app.routes.orders import orders_bp
    from app.routes.admin import admin_bp
    from app.routes.banners import banners_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(cart_bp, url_prefix='/api/cart')
    app.register_blueprint(favorites_bp, url_prefix='/api/favorites')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(banners_bp, url_prefix='/api/banners')

    # Create database tables
    with app.app_context():
        db.create_all()
        # Seed initial data
        from app.utils.seed import seed_data
        seed_data()

    return app
