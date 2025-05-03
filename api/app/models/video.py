from .extensions import db, get_uuid
from .relationships import video_hashtags, video_likes
from ..utils.video import sign_video_url


class Video(db.Model):
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    caption = db.Column(db.String(100), nullable=True)
    user_id = db.Column(db.String(32), db.ForeignKey("user.id"), nullable=False)

    user = db.relationship("User", back_populates="videos", cascade="all, delete")
    likes = db.relationship("User", secondary=video_likes, back_populates="liked_videos")
    comments = db.relationship("Comment", back_populates="video", cascade="all, delete")
    hashtags = db.relationship(
        "Hashtag", secondary=video_hashtags, back_populates="videos"
    )

    @property
    def key(self):
        return f"{self.user_id}/{self.id}"

    @property
    def signed_url(self):
        return sign_video_url(self.user_id, self.id)

    def to_json(self):
        return {
            "id": self.id,
            "caption": self.caption,
            "url": self.signed_url,
            "user": self.user.to_json(),
        }
