from flask import Blueprint, jsonify
from ..models.user import load_all_users

users = Blueprint("users", __name__)

@users.route("/list_users", methods=["GET"])
def list_users():
    user_objs = load_all_users()
    return jsonify([user.to_json() for user in user_objs]), 200