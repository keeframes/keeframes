from .extensions import db

# many to many
video_hashtags = db.Table(
    "video_hashtags",
    db.Column("video_id", db.String(32), db.ForeignKey("video.id")),
    db.Column("hashtag_id", db.String(32), db.ForeignKey("hashtag.id")),
)

video_likes = db.Table(
    "video_likes",
    db.Column("user_id", db.String(32), db.ForeignKey("user.id")),
    db.Column("video_id", db.String(32), db.ForeignKey("video.id"))
)

comment_likes = db.Table(
    "comment_likes",
    db.Column("user_id", db.String(32), db.ForeignKey("user.id")),
    db.Column("video_id", db.String(32), db.ForeignKey("video.id")),
    db.Column("comment_id", db.String(32), db.ForeignKey("comment.id"))
)
