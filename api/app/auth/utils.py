import requests
from flask import request, g, jsonify
from jose import jwt
from ..utils.constants import JWKS_URL, APP_CLIENT_ID, USER_POOL_ID, COGNITO_REGION

jwks = requests.get(JWKS_URL).json()


def verify_token(token):
    headers = jwt.get_unverified_headers(token)
    kid = headers["kid"]
    key = next((k for k in jwks["keys"] if k["kid"] == kid), None)
    if not key:
        raise Exception("Public Key not found in JWKS")
    payload = jwt.decode(
        token,
        key,
        algorithms=["RS256"],
        audience=APP_CLIENT_ID,
        issuer=f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USER_POOL_ID}",
        options={"verify_at_hash": False}
    )

    return payload


def load_user_from_token():
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        try:
            g.current_user = verify_token(token)
        except Exception:
            g.current_user = None
    else:
        g.current_user = None


def parse_auth_header():
    auth_header = request.headers.get("Authorization", None)
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify(error="Missing or invalid auth header"), 401

    token = auth_header.split()[1]

    return token
