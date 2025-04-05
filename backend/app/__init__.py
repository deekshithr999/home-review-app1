from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    import os
    if not os.path.exists('app/uploads'):
        os.makedirs('app/uploads')

    CORS(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///homes.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['UPLOAD_FOLDER'] = 'app/uploads'

    db.init_app(app)

    from .routes import main
    app.register_blueprint(main)

    with app.app_context():
        db.create_all()

    return app
