from datetime import datetime
from .extensions import db, get_uuid
from .relationships import user_follows
from .enums import UserGender
from .edit import Edit


class User(db.Model):
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    nickname = db.Column(db.String(40), nullable=False)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    age = db.Column(db.Integer())
    pronouns = db.Column(db.String(20))
    bio = db.Column(db.String(150), default="")
    created_at = db.Column(db.DateTime, default=datetime.now())
    gender = db.Column(db.Enum(UserGender), default=UserGender.PREFER)
    software_id = db.Column(db.String(32), db.ForeignKey("software.id"))
    picture_url = db.Column(db.Text)

    # this is the user id stored in cognito
    sub = db.Column(db.String(36), nullable=False, unique=True)

    software = db.relationship("Software")
    edits = db.relationship("Edit", back_populates="user", cascade="all, delete")
    comments = db.relationship("Comment", back_populates="user", cascade="all, delete")

    followers = db.relationship(
        "User",
        secondary=user_follows,
        primaryjoin=(user_follows.c.followed_id == id),
        secondaryjoin=(user_follows.c.follower_id == id),
        backref=db.backref("following"),
    )

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
        return Edit.query.filter_by(user=self).count()

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
            "nickname": self.nickname,
            "username": self.username,
            "pronouns": self.pronouns,
            "bio": self.bio,
            "created_at": self.created_at,
            "picture_url": self.picture_url
        }


def load_all_users():
    return User.query.all()
