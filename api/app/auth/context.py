from flask import g
from werkzeug.local import LocalProxy

current_user = LocalProxy(lambda: getattr(g, "current_user", None))
current_user_token = LocalProxy(lambda: getattr(g, "current_user_token", None))
current_user_cognito = LocalProxy(lambda: getattr(g, "current_user_cognito", None))
