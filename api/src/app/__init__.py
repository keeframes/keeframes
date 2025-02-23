from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_login import LoginManager, login_required, current_user

from app.config import ApplicationConfig
from app.routes import routes
from app.models import db, User

# add config to app
app = Flask(__name__)
app.config.from_object(ApplicationConfig)

# cross origin rubbish
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# hashing (eg password hashing)
bcrypt = Bcrypt(app)

# from flask login
login_manager = LoginManager(app)

# initialises database with app
db.init_app(app)

# initalises migrations
migrate = Migrate(app, db)

# registers all blueprints
app.register_blueprint(routes)

# just in case we have to remake db tables
#with app.app_context():
#    db.drop_all()
#    db.create_all()


# a function that login manager uses to load a user
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)
