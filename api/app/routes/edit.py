import boto3
import logging
from flask import jsonify, request, Blueprint
from flask_login import login_required, current_user
from ..models.edit import Edit
from ..models.extensions import db
from ..utils.helpers import query_user

edit_bp = Blueprint("edit", __name__)
logger = logging.getLogger(__name__)


@edit_bp.route("/edit/<id>", methods=["GET"])
def get_edit(id):
    # gets edit by id
    edit = Edit.query.get({"id": id})

    if not edit:
        return jsonify(error="EDIT_NOT_FOUND"), 404

    return jsonify(edit.to_json()), 200


@edit_bp.route("/edits", methods=["GET"])
def get_edits():
    # get a user
    username = request.args.get("username")
    user_id = request.args.get("user_id")
    email = request.args.get("email")

    user = query_user(user_id, username, email)

    if not user:
        return jsonify(error="USER_NOT_FOUND"), 404

    # query for an edit
    edit_query = Edit.query

    if user:
        edit_query = edit_query.filter_by(user=user)

    # get all edits from query
    edits = edit_query.all()

    return jsonify([edit.to_json() for edit in edits]), 200


@edit_bp.route("/edit", methods=["POST"])
@login_required
def create_edit():
    video = request.files.get("video")
    caption = request.form.get("caption")

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

    logger.info(f"Successfully uploaded edit {edit.id}")
    return jsonify(edit.to_json()), 201


@edit_bp.route("/edit/thumbnail_test", methods=["POST"])
def thumbnail_test():
    thumbnail = request.files.get("thumbnail")

    """
    when uploading to s3 check to see what bucket
    the bucket should be the static bucket which is
    called edits-static.

    the url where all thumbnails go will be
    edits/static/thumbnails/edit-id.png or jpg
    """
    print(thumbnail)
