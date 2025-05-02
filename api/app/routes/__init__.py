from flask import Blueprint
from .auth import auth
from .video import video

routes = Blueprint("routes", __name__)

routes.register_blueprint(auth)
routes.register_blueprint(video)

