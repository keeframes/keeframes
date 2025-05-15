from flask import g
from werkzeug.local import LocalProxy

current_user = LocalProxy(lambda: getattr(g, "current_user", None))
