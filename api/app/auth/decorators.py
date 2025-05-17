from functools import wraps
from flask import request, g, jsonify
from .utils import verify_token
from ..models import User


def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify(error="Missing or invalid Authorization header"), 401
        token = auth_header.split(" ")[1]
        try:
            payload = verify_token(token)
            user = User.query.filter_by(sub=payload["sub"]).first()
            g.current_user = user
            g.current_user_cognito = payload
            g.current_user_token = token
        except Exception as e:
            return jsonify(error=str(e)), 401

        return f(*args, **kwargs)

    return wrapper
