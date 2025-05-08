from flask import Blueprint, jsonify, request
from flask_login import login_user, logout_user, login_required, current_user
from ..models.extensions import db
from ..models.user import User

import logging

auth_bp = Blueprint("auth", __name__)
logger = logging.getLogger(__name__)


# TODO: NEED TO CHANGE THIS TO WORK WITH NEW FORM LAYOUT
@auth_bp.route("/signup", methods=["POST"])
def signup():
    # get signup values from body
    name = request.json.get("name")
    username = request.json.get("username")
    email = request.json.get("email")
    password = request.json.get("password")

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify(error="User already exists"), 409

    new_user = User(email=email, name=name, username=username)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "success": True,
        "user_id": new_user.id,
        "name": new_user.name,
        "email": new_user.email,
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")

    # user query filters until it finds first email match
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify(error="INVAILD_CREDENTIALS"), 401

    if not user.check_password(password):
        return jsonify(error="INVALID_CREDENTIALS"), 401

    if current_user:
        logout_user()

    login_user(user, remember=True)

    return "", 201


@auth_bp.route("/logout", methods=["GET"])
@login_required
def logout():
    logout_user()
    return "", 201


# checks to see if a user is authenticated
# the function runs if the login_required does not fail
@auth_bp.route("/is_authenticated", methods=["GET"])
@login_required
def is_authenticated():
    return jsonify(current_user.to_json()), 200
