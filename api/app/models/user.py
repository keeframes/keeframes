import bcrypt
from flask_login import UserMixin
from .extensions import db, get_uuid


class User(UserMixin, db.Model):
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid) # default=get_uuid ensures each user is uuid not normal autonumber 
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(300), nullable=False, unique=True)
    password = db.Column(db.Text)

    videos = db.relationship("Video", back_populates="user", cascade="all, delete")

    # flask login NEEDS this to be implemented
    def get_id(self):
        return str(self.id)

    # hashes password
    def set_password(self, password):
        self.password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode(
            "utf-8"
        )

    # compares 2 password hashes
    def check_password(self, password):
        hashed_password = self.password.encode("utf-8")
        return bcrypt.checkpw(password.encode(), hashed_password)
