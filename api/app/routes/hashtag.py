from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from ..models.hashtag import Hashtag
from ..models.extensions import db

hashtag = Blueprint("hashtag", __name__)


@hashtag.route("/hashtag", methods=["GET"])
def get_hashtag():
    name = request.args.get("name")
    id = request.args.get("id")

    if not name and not id:
        return jsonify({"error": "No name or id was passed"}), 400

    if name:
        hash = Hashtag.query.filter(Hashtag.name == name).first()
        if hash:
            return jsonify(hash.to_json()), 200
    elif id:
        hash = Hashtag.query.get({"id": id}).first()
        if hash:
            return jsonify(hash.to_json()), 200

    return jsonify({"error": "Could not find requested software"}), 404


@hashtag.route("/hashtags", methods=["GET"])
def get_hashtags():
    search = request.args.get("search")

    if search:
        hashtags = Hashtag.query.filter(
            Hashtag.name.icontains(search)
        )

        return jsonify([hash.to_json() for hash in hashtags]), 200

    hashtags = Hashtag.query.all()

    return jsonify([hash.to_json() for hash in hashtags])
