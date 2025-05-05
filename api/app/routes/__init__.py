from flask import Blueprint
from .auth import auth
from .edit import edit
from .users import users
from .chat import chat
from .software import software

routes = Blueprint("routes", __name__)

routes.register_blueprint(auth)
routes.register_blueprint(edit)
routes.register_blueprint(users)
routes.register_blueprint(chat)
routes.register_blueprint(software)
