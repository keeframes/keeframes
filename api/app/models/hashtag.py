from .extensions import db, get_uuid
from .relationships import edit_hashtags


class Hashtag(db.Model):
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(30), nullable=False)

    edits = db.relationship(
        "Edit", secondary=edit_hashtags, back_populates="hashtags"
    )
