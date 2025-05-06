import bcrypt
from datetime import datetime
from flask_login import UserMixin
from .extensions import db, get_uuid
from .relationships import edit_likes
from .relationships import followers


class User(UserMixin, db.Model):
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid) # default=get_uuid ensures each user is uuid not normal autonumber 
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(300), nullable=False, unique=True)
    password = db.Column(db.Text)
    admin = db.Column(db.Boolean, default=False)
    pronouns = db.Column(db.String(20))
    bio = db.Column(db.String(150), default="")
    created_at = db.Column(db.DateTime, default=datetime.now())

    edits = db.relationship("Edit", back_populates="user", cascade="all, delete")
    liked_edits = db.relationship("Edit", secondary=edit_likes, back_populates="likes")
    comments = db.relationship("Comment", back_populates="user", cascade="all, delete")

    followers = db.relationship(
        'User',
        secondary=followers,
        primaryjoin=(followers.c.followed_id == id),
        secondaryjoin=(followers.c.follower_id == id),
        backref=db.backref('following', lazy='dynamic'),
        lazy='dynamic'
    )

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

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "username": self.username
        }
    
def load_all_users():
    return User.query.all()
