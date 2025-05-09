import logging
from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from datetime import datetime
from ..models.user import load_all_users
from ..models.user import User
from ..models.enums import UserGender
from ..utils.helpers import query_user

user_bp = Blueprint("users", __name__)
logger = logging.getLogger(__name__)


@user_bp.route("/list_users", methods=["GET"])
def list_users():
    user_objs = load_all_users()
    return jsonify([user.to_json() for user in user_objs]), 200


@user_bp.route("/user/profile/<username>", methods=["GET"])
def get_profile(username):
    currentUsername = request.args.get("currentUsername")

    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify(error="USER_NOT_FOUND"), 404

    # format the month
    est_month = datetime.strftime(user.created_at, "%b")
    est_year = datetime.strftime(user.created_at, "%Y")
    est = f"est {est_month.upper()} {est_year}"

    # append extra details
    profile = user.to_json()
    profile["following_count"] = user.get_following_count()
    profile["follower_count"] = user.get_followers_count()
    profile["edit_count"] = user.get_edit_count()
    profile["est"] = est
    profile["is_following"] = False
    profile["pfp_url"] = f"{id}.png" if user.hasPfp else "default.jpg"

    # set is_following to true if the current user is following the user's profile
    if currentUsername:
        currentUser = User.query.filter(User.username == currentUsername).first()

        if currentUser.is_following(user):
            profile["is_following"] = True

    return jsonify(profile), 200


@user_bp.route("/user/follow", methods=["POST"])
@login_required
def follow_user():
    user_id = request.args.get("id")
    username = request.args.get("username")

    target = query_user(user_id, username)

    if not target:
        return jsonify(error="TARGET_NOT_FOUND"), 404

    # follow target
    current_user.follow_user(target)

    return "Success", 201


@user_bp.route("/user/unfollow", methods=["DELETE"])
@login_required
def unfollow_user():
    user_id = request.args.get("id")
    username = request.args.get("username")

    target = query_user(user_id, username)

    if not target:
        return jsonify(error="TARGET_NOT_FOUND"), 404

    # unfollow target
    current_user.unfollow_user(target)

    return "Success", 201


@user_bp.route("/user/exists", methods=["GET"])
def check_user_exists():
    username = request.args.get("username")
    id = request.args.get("id")
    email = request.args.get("email")

    user = query_user(id, username, email)

    if not user:
        return "USER_NOT_FOUND", 200

    if username:
        return jsonify(error="Username already exists"), 409
    if email:
        return jsonify(error="Email already exists"), 409
    if id:
        return jsonify(error="ID already exists"), 409

    return "USER_EXISTS", 200


@user_bp.route("/user/genders", methods=["GET"])
def get_genders():
    enum_values = [e.value for e in UserGender]
    return jsonify(enum_values), 200
