from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate

from .config import ApplicationConfig
from .routes import routes
from .models.extensions import db
from .models.user import User
from .socketio import socketio
from .auth import init_auth

import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()  # Also logs to console
    ]
)

logger = logging.getLogger(__name__)

# add config to app
app = Flask(__name__)
app.config.from_object(ApplicationConfig)

# cross origin rubbish
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# hashing (eg password hashing)
bcrypt = Bcrypt(app)

# initialises database with app
db.init_app(app)

# initalises migrations
migrate = Migrate(app, db)

# registers all blueprints
app.register_blueprint(routes)

# manual socketio app init
socketio.init_app(app)

# just in case we have to remake db tables
# with app.app_context():
#    db.drop_all()
#    db.create_all()


init_auth(app)


@app.errorhandler(Exception)
def handle_exception(error):
    db.session.rollback()
    logging.exception(error)

    return jsonify(error="INTERNAL_SERVER"), 500
