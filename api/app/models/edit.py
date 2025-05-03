from .extensions import db, get_uuid, get_timestamp
from .relationships import edit_hashtags, edit_likes
from ..utils.edit import sign_edit_url


class Edit(db.Model):
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    caption = db.Column(db.String(100), nullable=True)
    timestamp = db.Column(db.Integer, default=get_timestamp)
    user_id = db.Column(db.String(32), db.ForeignKey("user.id"), nullable=False)
    software_id = db.Column(db.String(32), db.ForeignKey("software.id"), nullable=False)

    user = db.relationship("User", back_populates="edits", cascade="all, delete")
    likes = db.relationship("User", secondary=edit_likes, back_populates="liked_edits")
    software = db.relationship("Software", back_populates="edits", cascade="all, delete")
    comments = db.relationship("Comment", back_populates="edit", cascade="all, delete")
    hashtags = db.relationship(
        "Hashtag", secondary=edit_hashtags, back_populates="edits"
    )

    @property
    def key(self):
        return f"{self.user_id}/{self.id}"

    @property
    def signed_url(self):
        return sign_edit_url(self.user_id, self.id)

    def to_json(self):
        return {
            "id": self.id,
            "caption": self.caption,
            "url": self.signed_url,
            "user": self.user.to_json(),
            "timestamp": self.timestamp
        }
