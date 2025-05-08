from flask import Blueprint
from .auth import auth_bp
from .edit import edit_bp
from .user import user_bp
from .chat import chat_bp
from .software import software_bp
from .hashtag import hashtag_bp

routes = Blueprint("routes", __name__)

routes.register_blueprint(auth_bp)
routes.register_blueprint(edit_bp)
routes.register_blueprint(user_bp)
routes.register_blueprint(chat_bp)
routes.register_blueprint(software_bp)
routes.register_blueprint(hashtag_bp)
