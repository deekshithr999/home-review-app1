from flask import Blueprint, request, jsonify
from .models import User
from . import db

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return {"message": "Hello from Flask backend!"}

@main.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Missing fields"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 409

    user = User(username=username, password=password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201
