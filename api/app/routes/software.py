import logging
import boto3
from flask import Blueprint, request, jsonify
from ..models.extensions import db
from ..models.software import Software
from ..utils.helpers import query_software
from ..auth import login_required, current_user

software_bp = Blueprint("software", __name__)
logger = logging.getLogger(__name__)


@software_bp.route("/software", methods=["GET"])
def get_software():
    id = request.args.get("id")
    name = request.args.get("name")

    software = query_software(id, name)

    if not software:
        return jsonify(error="SOFTWARE_NOT_FOUND"), 404

    return jsonify(software.to_json()), 200


@software_bp.route("/softwares", methods=["GET"])
def get_all_software():
    t = request.args.get("type")

    query = Software.query

    if t:
        query = query.filter_by(type=t)

    software = query.all()

    return jsonify([s.to_json() for s in software])


@software_bp.route("/software", methods=["POST"])
@login_required
def create_software():
    image = request.files.get("image")
    t = request.form.get("type")
    name = request.form.get("name")

    if not t:
        return jsonify(error="NO_TYPE", message="This software needs a type (official or other)"), 400

    if not name:
        return jsonify(error="NO_NAME", message="This software needs a name"), 400

    if t != "other" and not image:
        return jsonify(error="NO_IMAGE", message="No image has been provided when the type is official"), 409

    # formatting
    t = t.lower()

    # add software to db
    s = Software(type=t, name=name)
    db.session.add(s)

    # assigns an id to edit without committing
    db.session.flush()

    if s.type != "other":
        # upload image to s3
        extension = image.filename.split(".")[-1]
        s3_client = boto3.client("s3")
        object_name = f"static/software/{s.type}/{s.id}.{extension}"
        s3_client.upload_fileobj(image, "edits-static", object_name)

    db.session.commit()

    return jsonify({"message": "success"}), 200
