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

    if not name and not id:
        return jsonify({"error": "No name or id was passed"}), 400

    if name:
        app = Software.query.filter(Software.name == name).first()
        if app:
            return jsonify(app.to_json()), 200
    elif id:
        app = Software.query.get({"id": id}).first()
        if app:
            return jsonify(app.to_json()), 200

    return jsonify({"error": "Could not find requested software"}), 404


@software.route("/softwares", methods=["GET"])
def get_all_software():
    t = request.args.get("type")

    if t:
        softwares = Software.query.filter(Software.type == t).all()
    else:
        softwares = Software.query.all()

    return jsonify([s.to_json() for s in softwares])


@software.route("/software", methods=["POST"])
@login_required
def create_software():
    image = request.files.get("image")
    t = request.form.get("type")
    name = request.form.get("name")
    
    extension = image.filename.split(".")[-1]

    if not t:
        return jsonify("This software needs a type"), 400

    if not name:
        return jsonify("This software needs a name"), 400

    if t != "other" and not image:
        return jsonify({"error": "No image has been provided when the type is official"}), 409

    try:
        # add software to db
        s = Software(type=t, name=name)
        db.session.add(s)

        # assigns an id to edit without committing
        db.session.flush()

        if s.type != "other":
            # upload image to s3
            s3_client = boto3.client("s3")
            object_name = f"static/software/{s.type}/{s.id}.{extension}"
            s3_client.upload_fileobj(image, "edits-static", object_name)

        db.session.commit()
    except Exception as e:
        db.session.rollback()
        logger.error(e)
        return jsonify({"error": "Internal server error occured"})

    return jsonify({"message": "success"}), 200
