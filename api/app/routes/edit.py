import boto3
import logging
from flask import jsonify, request, Blueprint
from flask_login import login_required, current_user
from ..models.edit import Edit
from ..models.extensions import db

edit = Blueprint("edit", __name__)
logger = logging.getLogger(__name__)


@edit.route("/edit/<id>", methods=["GET"])
def get_edit(id):
    try:
        edit = Edit.query.get({"id": id})

        if not edit:
            message = f"edit with id: {id} could not be found"
            return jsonify({"error": message}), 400

    except Exception as e:
        db.session.rollback()
        logger.error(e)
        return jsonify({"error": "Internal server error occured"}), 500

    return jsonify(edit.to_json()), 200


@edit.route("/edits", methods=["GET"])
def get_edits():
    try:
        # get all edits
        edits = Edit.query.all()
    except Exception as e:
        db.session.rollback()
        logger.error(e)
        return jsonify({"error": "Internal server error occured"}), 500

    return jsonify({"edits": [edit.to_json() for edit in edits]}), 200


@edit.route("/edit", methods=["POST"])
@login_required
def create_edit():
    video = request.files.get("video")
    caption = request.form.get("caption")

    try:
        # add edit to a database
        edit = Edit(caption=caption, user=current_user)
        db.session.add(edit)

        # this assigns an id to the edit without comitting it
        db.session.flush()

        # upload edit object to s3 using edit id and user id as a key
        s3_client = boto3.client("s3")
        object_name = f"{current_user.id}/{edit.id}"
        s3_client.upload_fileobj(video, "edits-dev", object_name)

        # commit changes
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        logger.error(e)
        return jsonify({"error": "Internal server error occured"}), 500

    logging.info(f"Successfully uploaded edit {edit.id}")
    return jsonify({"message": "success"}), 200
