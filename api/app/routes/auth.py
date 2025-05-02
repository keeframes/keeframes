from flask import Blueprint, jsonify, request
from app.models import User, db
from flask_login import login_user, logout_user, login_required, current_user

auth = Blueprint("auth", __name__)


@auth.route("/signup", methods=["POST"])
def signup():
    name = request.json.get("name")
    email = request.json.get("email")
    password = request.json.get("password")

    user_exists = User.query.filter_by(email=email).first() is not None # checks for existing account email match

    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    new_user = User(email=email, name=name)
    new_user.set_password(password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return (
            jsonify(
                {
                    "success": True,
                    "user_id": new_user.id,
                    "name": new_user.name,
                    "email": new_user.email,
                }
            ),
            201,
        )
    except Exception:
        db.session.rollback() # reverts database changes once error caught
        return jsonify({"error": "Internal Server Error"}), 500


@auth.route("/login", methods=["POST"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")

    user = User.query.filter_by(email=email).first() # user query filters until it finds first email match

    if not user:
        return jsonify({"error": "User not found"}), 401

    if not user.check_password(password):
        return jsonify({"error": "Password not a match"}), 401

    if current_user:
        logout_user()

    login_user(user, remember=True)

    return jsonify({"success": "success"}), 201


@auth.route("/logout", methods=["GET"])
@login_required
def logout():
    logout_user()
    return jsonify({"success": "User logged out"}), 201


# checks to see if a user is authenticated
# the function runs if the login_required does not fail
@auth.route("/is_authenticated", methods=["GET"])
@login_required
def is_authenticated():
    return jsonify(True), 200
