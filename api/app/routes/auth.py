from flask import Blueprint, jsonify, request
from ..models.extensions import db
from ..models.user import User
from ..models.enums import UserGender
from ..utils.helpers import query_software, random_username
from ..auth import (
    verify_token,
    parse_auth_header,
    login_required,
    current_user,
    current_user_cognito,
)

import logging
import boto3

auth_bp = Blueprint("auth", __name__)
logger = logging.getLogger(__name__)


@auth_bp.route("/signup", methods=["POST"])
def signup():
    nickname = request.form.get("nickname")
    username = request.form.get("username")
    email = request.form.get("email")

    # cognito user id = sub
    sub = request.form.get("sub")

    user = User(nickname=nickname, username=username, email=email, sub=sub)

    db.session.add(user)
    db.session.commit()

    return jsonify("Successfully created user"), 200


@auth_bp.route("/signup/google", methods=["POST"])
def signup_google():
    # get aws token
    token = parse_auth_header()
    print(token)
    payload = verify_token(token)

    if not payload:
        return jsonify(error="Invalid token"), 401

    # grab google account data
    sub = payload.get("sub")
    email = payload.get("email")
    nickname = payload.get("name")
    picture_url = payload.get("picture")

    # check if user exists
    is_exists = User.query.filter_by(email=email).first()
    if is_exists:
        return jsonify("User already exists"), 400

    # generate a random username and create a user
    username = random_username()
    user = User(
        username=username,
        sub=sub,
        email=email,
        nickname=nickname,
        picture_url=picture_url,
    )

    db.session.add(user)
    db.session.commit()

    return jsonify(user.to_json()), 200


@auth_bp.route("/is_authenticated", methods=["GET"])
@login_required
def is_authenticated():
    return current_user.to_json()


@auth_bp.route("/user", methods=["DELETE"])
@login_required
def delete_user():
    client = boto3.client("cognito-idp")

    print(current_user_cognito)
    response = client.delete_user(AccessToken=str(current_user_cognito))
    print(response)

    return jsonify("user deleted"), 200
