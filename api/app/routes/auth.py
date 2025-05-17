from flask import Blueprint, jsonify, request, session, redirect, render_template_string
from ..models.extensions import db
from ..models.user import User
from ..models.enums import UserGender
from ..utils.helpers import query_software, random_username, user_exists
from ..utils.cognito import CognitoClient
from ..auth import login_required, current_user, verify_token
from ..utils.constants import COGNITO_DOMAIN, COGNITO_REDIRECT_URI

import logging
import json

auth_bp = Blueprint("auth", __name__)
logger = logging.getLogger(__name__)


def oauth_to_frontend(id_token):
    return f"""
        <html>
          <body>
            <script>
              window.opener.postMessage({json.dumps({
                "type": "OAUTH_SUCCESS",
                "data": {"idToken": id_token}
              })}, "http://localhost:5173/signup");
              window.close();
            </script>
            <p>Signing you in...</p>
          </body>
        </html>

"""


@auth_bp.route("/auth/signup", methods=["POST"])
def signup():
    nickname = request.form.get("nickname")
    username = request.form.get("username")
    email = request.form.get("email")
    password = request.form.get("password")

    # check if user exists
    if user_exists(email=email):
        return jsonify(error="USER_EXISTS", message="User already exists")

    # sign up the user
    client = CognitoClient()
    response = client.sign_up(email, password)

    # error checks
    error = response.get("error")
    if error == "EMAIL_EXISTS":
        return jsonify(response), 409
    if error == "COGNITO_ERROR":
        return jsonify(response), 400

    # this is the cognito user id
    sub = response.get("UserSub")

    # create a user
    user = User(nickname=nickname, username=username, email=email, sub=sub)

    # commit a user
    db.session.add(user)
    db.session.commit()

    return jsonify("Successfully created user"), 200


@auth_bp.route("/auth/signup/confirm", methods=["POST"])
def confirm_account():
    email = request.form.get("email")
    code = str(request.form.get("code"))

    # confirm account in cognito
    client = CognitoClient()
    response = client.confirm_account(email, code)

    if response:
        return jsonify(response), 400

    return jsonify("Successfully confirmed account"), 200


# only use this for debugging
@auth_bp.route("/auth/admin/confirm", methods=["POST"])
def admin_confirm_account():
    email = request.form.get("email")

    if not email:
        return jsonify(error="NO_EMAIL", message="Provide an email"), 400

    # confirm account in cognito
    client = CognitoClient()
    response = client.admin_confirm(email)

    if response:
        return jsonify(response), 400

    return jsonify("Successfully confirmed account"), 200


@auth_bp.route("/auth/code/resend", methods=["GET"])
def resend_code():
    email = request.form.get("email")

    if not email:
        return jsonify(error="NO_EMAIL", message="Provide an email"), 400

    client = CognitoClient()
    response = client.resend_code(email)
    error = response.get("error")

    if error:
        return jsonify(error), 400

    return jsonify(message="Successfully resent confirmation code"), 200


@auth_bp.route("/auth/login", methods=["POST"])
def login():
    email = request.form.get("email")
    password = request.form.get("password")

    # log in the user
    client = CognitoClient()
    response = client.login(email, password)

    error = response.get("error")
    if error in ["INCORRECT_DETAILS", "CONFIRM_ACCOUNT", "COGNITO_ERROR"]:
        return jsonify(response), 400

    result = response.get("AuthenticationResult")

    # JWT token for identifying users (eg. username, password)
    id_token = result.get("IdToken")

    # JWT token for accessing aws resources (eg. API Gateway)
    access_token = result.get("AccessToken")

    # token for automatically refreshing user's login sessions
    refresh_token = result.get("RefreshToken")

    # we store these tokens in a flask session
    # so we can access them for the same user across requests
    # we store these tokens because these have sensitive info
    session["access_token"] = access_token
    session["refresh_token"] = refresh_token

    return jsonify({"idToken": id_token}), 200


@auth_bp.route("/auth/login/refresh", methods=["GET"])
def refresh_tokens():
    refresh_token = session.get("refresh_token")

    if not refresh_token:
        return jsonify(error="NO_REFRESH_TOKEN", message="There is no refresh token")

    client = CognitoClient()
    result = client.refresh_tokens(refresh_token)

    # JWT token for identifying users (eg. username, password)
    id_token = result.get("IdToken")

    # JWT token for accessing aws resources (eg. API Gateway)
    access_token = result.get("AccessToken")

    # add the access token into the session
    session["access_token"] = access_token

    return jsonify(idToken=id_token), 200


@auth_bp.route("/auth/google", methods=["GET"])
def google_oauth():
    client = CognitoClient()

    url = client.build_url()

    print(url)

    return redirect(url)


@auth_bp.route("/auth/callback", methods=["GET"])
def oauth_callback():
    # grab google's oauth code
    code = request.args.get("code")

    # handle oauth callback
    client = CognitoClient()
    response = client.handle_oauth_callback(code)

    # get all the tokens
    id_token = response.get("id_token")
    access_token = response.get("access_token")
    refresh_token = response.get("refresh_token")

    # add the tokens to the session
    session["access_token"] = access_token
    session["refresh_token"] = refresh_token

    # decrypt id token
    payload = verify_token(id_token)

    # grab google account data
    sub = payload.get("sub")
    email = payload.get("email")
    nickname = payload.get("name")
    picture_url = payload.get("picture")

    # if user already exists return id token (logs them in)
    is_exists = User.query.filter_by(email=email).first()
    if is_exists:
        return oauth_to_frontend(id_token)

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

    return oauth_to_frontend(id_token)


@auth_bp.route("/auth/delete", methods=["DELETE"])
@login_required
def delete_user():
    access_token = session.get("access_token")

    # delete user in cognito
    client = CognitoClient()
    client.delete_user(access_token)

    # delete user in database
    db.session.delete(current_user)
    db.session.commit()

    return jsonify("Successfully deleted user"), 200


@auth_bp.route("/auth/authenticated", methods=["GET"])
@login_required
def is_authenticated():
    return current_user.to_json()
