from .extensions import db, get_uuid
from .relationships import video_hashtags


class Video(db.Model):
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    caption = db.Column(db.String(100), nullable=True)
    user_id = db.Column(db.String(32), db.ForeignKey("user.id"), nullable=False)

    user = db.relationship("User", back_populates="videos", cascade="all, delete")
    hashtags = db.relationship(
        "Hashtag", secondary=video_hashtags, back_populates="videos"
    )

    def to_json(self):
        return {"id": self.id, "caption": self.caption}
