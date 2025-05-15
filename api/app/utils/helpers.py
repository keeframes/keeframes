from ..models.user import User
from ..models.hashtag import Hashtag
from ..models.edit import Edit
from ..models.software import Software
from faker import Faker


def random_username():
    fake = Faker()
    while True:
        username = fake.user_name()

        is_exists = User.query.filter_by(username=username).first()

        if not is_exists:
            break
    return username


def query_user(id=None, username=None, email=None):
    # query for a user
    query = User.query

    if username:
        query = query.filter_by(username=username)
    if id:
        query = query.filter_by(id=id)
    if email:
        query = query.filter_by(email=email)

    user = query.first()

    return user


def query_hashtag(id=None, name=None):
    query = Hashtag.query

    if id:
        query = query.filter_by(id=id)
    if name:
        query = query.filter_by(name=name)

    hashtag = query.first()

    return hashtag


def query_edit(id=None):
    query = Edit.query

    if id:
        query = query.filter_by(id=id)

    edit = query.first()

    return edit


def query_software(id=None, name=None):
    query = Software.query

    if id:
        query = query.filter_by(id=id)
    if name:
        query = query.filter_by(name=name)

    software = query.first()

    return software
