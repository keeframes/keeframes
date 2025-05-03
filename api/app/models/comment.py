from .extensions import db, get_uuid
from .relationships import comment_likes


class Comment(db.Model):
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid) # default=get_uuid ensures each user is uuid not normal autonumber 
    content = db.Column(db.String(100), nullable=False)
    reply_id = db.Column(db.String(32), db.ForeignKey("comment.id", ondelete="CASCADE", onupdate="CASCADE"))
    user_id = db.Column(db.String(32), db.ForeignKey("user.id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False)
    edit_id = db.Column(db.String(32), db.ForeignKey("edit.id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False)

    user = db.relationship("User", back_populates="comments", cascade="all, delete")
    edit = db.relationship("Edit", back_populates="comments", cascade="all, delete")

    liked_comments = db.relationship("Comment", secondary=comment_likes)

    replies = db.relationship(
        "Comment",
        backref=db.backref("parent", remote_side=[id]),
        cascade="all, delete"
    )
