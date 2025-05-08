from flask import Blueprint, request, jsonify
from ..models.hashtag import Hashtag
from ..utils.helpers import query_hashtag

import logging

hashtag_bp = Blueprint("hashtag", __name__)
logger = logging.getLogger(__name__)


@hashtag_bp.route("/hashtag", methods=["GET"])
def get_hashtag():
    name = request.args.get("name")
    id = request.args.get("id")

    hashtag = query_hashtag(id, name)

    if not hashtag:
        return jsonify(error="HASHTAG_NOT_FOUND"), 404

    return jsonify(hashtag.to_json()), 200


# TODO: NEED TO ADD FUNCTIONALITY TO GET HASHTAGS FOR AN EDIT
@hashtag_bp.route("/hashtags", methods=["GET"])
def get_hashtags():
    search = request.args.get("search")
    # edit_id = request.args.get("edit_id")

    query = Hashtag.query

    if search:
        query = query.filter(Hashtag.name.icontains(search))

    hashtags = query.all()

    return jsonify([hash.to_json() for hash in hashtags])
