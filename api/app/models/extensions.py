from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from datetime import timezone
from datetime import datetime

import math

db = SQLAlchemy()

# creates a uuid


def get_uuid():
    return uuid4().hex


def get_timestamp():
    now = datetime.now(timezone.utc)
    timestamp = now.replace(tzinfo=timezone.utc).timestamp()
    return math.floor(timestamp)
