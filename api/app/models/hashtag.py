from .extensions import db, get_uuid


class Hashtag(db.Model):
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(30), nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name
        }
