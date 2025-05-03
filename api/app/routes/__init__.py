from flask import Blueprint
from .auth import auth
from .video import video
from .users import users
from .chat import chat

routes = Blueprint("routes", __name__)

routes.register_blueprint(auth)
routes.register_blueprint(video)
routes.register_blueprint(users)
routes.register_blueprint(chat)

