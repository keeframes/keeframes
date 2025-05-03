from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db = SQLAlchemy()

# creates a uuid


def get_uuid():
    return uuid4().hex
