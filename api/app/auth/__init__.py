from flask import request, g
from .utils import verify_token, load_user_from_token, parse_auth_header
from .context import current_user, current_user_token, current_user_cognito
from .decorators import login_required

def init_auth(app):
    @app.before_request
    def load_user():
        load_user_from_token()
