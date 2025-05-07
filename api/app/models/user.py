import bcrypt
from datetime import datetime
from flask_login import UserMixin
from sqlalchemy.orm import aliased
from .extensions import db, get_uuid
from .relationships import edit_likes
from .relationships import user_follows
from .edit import Edit


class User(UserMixin, db.Model):
    id = db.Column(
        db.String(32), primary_key=True, unique=True, default=get_uuid
    )  # default=get_uuid ensures each user is uuid not normal autonumber
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(300), nullable=False, unique=True)
    password = db.Column(db.Text)
    admin = db.Column(db.Boolean, default=False)
    pronouns = db.Column(db.String(20))
    bio = db.Column(db.String(150), default="")
    created_at = db.Column(db.DateTime, default=datetime.now())
    hasPfp = db.Column(db.Boolean, default=False)

    edits = db.relationship(
        "Edit", back_populates="user", cascade="all, delete")
    liked_edits = db.relationship(
        "Edit", secondary=edit_likes, back_populates="likes")
    comments = db.relationship(
        "Comment", back_populates="user", cascade="all, delete")

    followers = db.relationship(
        "User",
        secondary=user_follows,
        primaryjoin=(user_follows.c.followed_id == id),
        secondaryjoin=(user_follows.c.follower_id == id),
        backref=db.backref("following"),
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

    # gets followers count
    def get_followers_count(self):
        return (
            db.session.query(user_follows)
            .filter(user_follows.c.followed_id == self.id)
            .count()
        )

    # get following count
    def get_following_count(self):
        return (
            db.session.query(user_follows)
            .filter(user_follows.c.follower_id == self.id)
            .count()
        )

    # gets edit count
    def get_edit_count(self):
        return Edit.query.count()

    # checks whether a user is following another user
    def is_following(self, other):
        follow = (
            db.session.query(user_follows)
            .filter(
                user_follows.c.follower_id == self.id,
                user_follows.c.followed_id == other.id,
            )
            .first()
        )

        return True if follow else False

    # follows a user
    def follow_user(self, other):
        # checks if already following
        exists = (
            db.session.query(user_follows)
            .filter_by(follower_id=self.id, followed_id=other.id)
            .first()
        )

        # if not already following
        if not exists:
            db.session.execute(
                user_follows.insert().values(follower_id=self.id, followed_id=other.id)
            )

        db.session.commit()

    # unfollows a user
    def unfollow_user(self, other):
        db.session.execute(
            user_follows.delete().where(
                user_follows.c.follower_id == self.id,
                user_follows.c.followed_id == other.id,
            )
        )
        db.session.commit()

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "username": self.username,
            "pronouns": self.pronouns,
            "bio": self.bio,
            "created_at": self.created_at,
            "has_pfp": self.hasPfp
        }


def load_all_users():
    return User.query.all()
