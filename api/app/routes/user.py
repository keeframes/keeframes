import logging
from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from datetime import datetime
from ..models.extensions import db
from ..models.user import load_all_users
from ..models.user import User

user_bp = Blueprint("users", __name__)
logger = logging.getLogger(__name__)


@user_bp.route("/list_users", methods=["GET"])
def list_users():
    user_objs = load_all_users()
    return jsonify([user.to_json() for user in user_objs]), 200


@user_bp.route("/user/profile/<username>", methods=["GET"])
def get_profile(username):
    currentUsername = request.args.get("currentUsername")

    try:
        user = User.query.filter(User.username == username).first()

        if not user:
            return jsonify({"error": "User does not exist"}), 404

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

        if currentUsername:
            currentUser = User.query.filter(User.username == currentUsername).first()

            print(currentUser.username)
            if currentUser.is_following(user):
                profile["is_following"] = True

        return jsonify(profile), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "Internal server error has occured"}), 500


@user_bp.route("/user/follow", methods=["POST"])
@login_required
def follow_user():
    user_id = request.args.get("id")
    username = request.args.get("username")
    follower = current_user

    if not user_id and not username:
        return jsonify({"error": "no id or username parameter"}), 400

    followed = None
    # get user by id
    if user_id:
        followed = User.query.filter(
            User.id == user_id
        ).first()

    # get user by username
    if username:
        followed = User.query.filter(
            User.username == username
        ).first()

    if not followed:
        return jsonify({"error": "User does not exist"}), 404

    try:
        follower.follow_user(followed)
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"error": "Internal server error has occured"}), 500

    return jsonify({"success": True}), 201


@user_bp.route("/user/unfollow", methods=["DELETE"])
@login_required
def unfollow_user():
    user_id = request.args.get("id")
    username = request.args.get("username")
    follower = current_user

    if not user_id and not username:
        return jsonify({"error": "no id or username parameter"}), 400

    followed = None
    # get user by id
    if user_id:
        followed = User.query.filter(
            User.id == user_id
        ).first()

    # get user by username
    if username:
        followed = User.query.filter(
            User.username == username
        ).first()

    if not followed:
        return jsonify({"error": "User does not exist"}), 404

    try:
        follower.unfollow_user(followed)
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"error": "Internal server error has occured"}), 500

    return jsonify({"success": True}), 201
