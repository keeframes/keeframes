import bcrypt

from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from uuid import uuid4

db = SQLAlchemy() # flask ORM


# creates a uuid
def get_uuid():
    return uuid4().hex


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


# many to many
video_hashtags = db.Table(
    "video_hashtags",
    db.Column("video_id", db.String(32), db.ForeignKey("video.id")),
    db.Column("hashtag_id", db.String(32), db.ForeignKey("hashtag.id")),
)


class Video(db.Model):
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    caption = db.Column(db.String(100), nullable=True)
    user_id = db.Column(db.String(32), db.ForeignKey("user.id"), nullable=False)

    user = db.relationship("User", back_populates="videos", cascade="all, delete")
    hashtags = db.relationship("Hashtag", secondary=video_hashtags, back_populates="videos")

    def to_json(self):
        return {
            "id": self.id,
            "caption": self.caption
        }


class Hashtag(db.Model):
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(30), nullable=False)

    videos = db.relationship("Video", secondary=video_hashtags, back_populates="hashtags")
