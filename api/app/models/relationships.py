from .extensions import db

# many to many
video_hashtags = db.Table(
    "video_hashtags",
    db.Column("video_id", db.String(32), db.ForeignKey("video.id")),
    db.Column("hashtag_id", db.String(32), db.ForeignKey("hashtag.id")),
)
