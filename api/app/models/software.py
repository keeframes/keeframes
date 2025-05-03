from .extensions import db, get_uuid


class Software(db.Model):
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid) # default=get_uuid ensures each user is uuid not normal autonumber 
    name = db.Column(db.String(32), nullable=False)
    type = db.Column(db.String(32), nullable=False)

    edits = db.relationship("Edit", back_populates="software", cascade="all, delete")

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type
        }
