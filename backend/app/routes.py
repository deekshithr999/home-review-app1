from flask import Blueprint, request, jsonify
from .models import User, Home, Review
from . import db
from werkzeug.security import generate_password_hash, check_password_hash

import os


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

    hashed_pw = generate_password_hash(password)
    user = User(username=username, password=hashed_pw)

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


@main.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid username or password"}), 401

    return jsonify({"message": "Login successful"}), 200


@main.route('/review', methods=['POST'])
def submit_review():
    username = request.form.get('username')
    address = request.form.get('address')
    rating = request.form.get('rating')
    comment = request.form.get('comment')
    image = request.files.get('image')

    user = User.query.filter_by(username=username).first()
    if not user:
        return {"error": "User not found"}, 404

    home = Home.query.filter_by(address=address).first()
    if not home:
        home = Home(address=address)
        db.session.add(home)
        db.session.commit()

    image_path = None
    if image:
        filename = f"{username}_{image.filename}"
        filepath = os.path.join('app', 'uploads', filename)
        image.save(filepath)
        image_path = filepath

    review = Review(
        rating=int(rating),
        comment=comment,
        user_id=user.id,
        home_id=home.id,
        image_path=image_path
    )
    db.session.add(review)
    db.session.commit()

    return {"message": "Review submitted with image" if image else "Review submitted"}


@main.route('/reviews', methods=['GET'])
def get_reviews():
    address = request.args.get('address')

    if not address:
        return {"error": "Address is required"}, 400

    home = Home.query.filter_by(address=address).first()
    if not home:
        return {"error": "Home not found"}, 404

    reviews = Review.query.filter_by(home_id=home.id).all()

    results = []
    for review in reviews:
        results.append({
            "username": review.user.username,
            "rating": review.rating,
            "comment": review.comment,
            "image": review.image_path
        })

    return {"reviews": results}
