import logging
import boto3
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from ..models.extensions import db
from ..models.software import Software

software = Blueprint("software", __name__)
logger = logging.getLogger(__name__)


@software.route("/software", methods=["GET"])
def get_software():
    name = request.args.get("name")
    id = request.args.get("id")

    if name:
        app = Software.query.get({"name": name})
        return jsonify(app.to_json()), 200
    elif id:
        app = Software.query.get({"id": id})
        return jsonify(app.to_json()), 200

    return jsonify({"error": "Could not find requested software"}), 404


@software.route("/softwares", methods=["GET"])
def get_all_software():
    softwares = Software.query.get().all()

    return jsonify([s.to_json() for s in softwares])


@software.route("/software", methods=["POST"])
@login_required
def create_software():
    image = request.files.get("image")
    t = request.form.get("type")
    name = request.form.get("name")

    try:
        # add software to db
        s = Software(type=t, name=name)
        db.session.add(s)

        # assigns an id to edit without committing
        db.session.flush()

        # upload image to s3
        s3_client = boto3.client("s3")
        object_name = f"{s.type}/{s.id}"
    except Exception as e:
        db.session.rollback()
        logger.error(e)
        return jsonify({"error": "Internal server error occured"})
