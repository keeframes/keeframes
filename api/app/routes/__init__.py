from flask import Blueprint
from .auth import auth
from .edit import edit
from .user import user_bp
from .chat import chat
from .software import software
from .hashtag import hashtag

routes = Blueprint("routes", __name__)

routes.register_blueprint(auth)
routes.register_blueprint(edit)
routes.register_blueprint(user_bp)
routes.register_blueprint(chat)
routes.register_blueprint(software)
routes.register_blueprint(hashtag)
