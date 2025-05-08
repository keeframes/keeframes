from .extensions import db

# many to many
edit_hashtags = db.Table(
    "edit_hashtags",
    db.Column("edit_id", db.String(32), db.ForeignKey("edit.id")),
    db.Column("hashtag_id", db.String(32), db.ForeignKey("hashtag.id")),
)

edit_likes = db.Table(
    "edit_likes",
    db.Column("user_id", db.String(32), db.ForeignKey("user.id", ondelete="CASCADE")),
    db.Column("edit_id", db.String(32), db.ForeignKey("edit.id", ondelete="CASCADE"))
)

comment_likes = db.Table(
    "comment_likes",
    db.Column("user_id", db.String(32), db.ForeignKey("user.id", ondelete="CASCADE")),
    db.Column("edit_id", db.String(32), db.ForeignKey("edit.id", ondelete="CASCADE")),
    db.Column("comment_id", db.String(32), db.ForeignKey("comment.id", ondelete="CASCADE"))
)

user_follows = db.Table(
    'followers',
    db.Column('follower_id', db.String(32), db.ForeignKey('user.id'), primary_key=True),
    db.Column('followed_id', db.String(32), db.ForeignKey('user.id'), primary_key=True)
)
