from flask import Blueprint, jsonify, request
from flask_login import login_user, logout_user, login_required, current_user
from ..models.extensions import db
from ..models.user import User
from ..models.enums import UserGender
from ..utils.helpers import query_software

import logging
import boto3

auth_bp = Blueprint("auth", __name__)
logger = logging.getLogger(__name__)


# TODO: NEED TO CHANGE THIS TO WORK WITH NEW FORM LAYOUT
@auth_bp.route("/signup", methods=["POST"])
def signup():
    name = request.form.get("fullname")
    username = request.form.get("username")
    email = request.form.get("email")
    bio = request.form.get("bio")
    age = request.form.get("age")

    password = request.form.get("password")
    gender = request.form.get("gender")
    pronouns = request.form.get("pronouns")
    custom_pronouns = request.form.get("customPronouns")
    software = request.form.get("software")
    pfp = request.files.get("pfp")

    user = User(name=name, username=username, email=email, age=int(age), bio=bio)

    # sets the password
    user.set_password(password)

    # sets the gender
    user.gender = UserGender(gender)

    # sets the pronouns
    if pronouns == "custom":
        user.pronouns = custom_pronouns
    else:
        user.pronouns = pronouns

    # sets the software
    if software:
        user.software_id = software

    # sets the bio
    if bio:
        user.bio = bio

    if pfp:
        user.has_pfp = True
        db.session.add(user)
        db.session.flush()

        s3_client = boto3.client("s3")
        object_name = f"static/pfp/{user.id}.png"
        s3_client.upload_fileobj(pfp, "edits-static", object_name)
    else:
        db.session.add(user)

    db.session.commit()

    return jsonify("Successfully created user"), 200


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
