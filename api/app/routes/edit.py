import boto3
import logging
from flask import jsonify, request, Blueprint
from ..models.edit import Edit
from ..models.extensions import db
from ..utils.helpers import query_user
from ..utils.compression import img_compression
from ..auth import login_required, current_user

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
    thumbnail = request.files.get("thumbnail")

    if not video or not caption or not thumbnail:
        return jsonify(error="MISSING_FIELDS"), 400

    # add edit to a database
    edit = Edit(caption=caption, user=current_user)
    db.session.add(edit)

    # this assigns an id to the edit without comitting it
    db.session.flush()

    # upload edit object to s3 using edit id and user id as a key
    s3_client = boto3.client("s3")
    object_name = f"{current_user.id}/{edit.id}"
    s3_client.upload_fileobj(video, "edits-dev", object_name)

    compressed_thumbnail = img_compression(thumbnail)
    compressed_thumbnail.seek(0) # rewind bytesio to 0 pre upload

    # thumbnail upload to s3 static bucket
    thumb_key = f"static/thumbnails/{current_user.id}/{edit.id}.png"
    s3_client.upload_fileobj(compressed_thumbnail, "edits-static", thumb_key, ExtraArgs={"ContentType": "image/png"})    

    # commit changes
    db.session.commit()

    logger.info(f"Successfully uploaded edit {edit.id}")
    return jsonify(edit.to_json()), 201


@edit_bp.route("/edit/thumbnail", methods=["POST"])
def thumbnail():
    thumbnail = request.files.get("thumbnail")
    db.session.add(thumbnail)

    # upload edit object to s3 using edit id and user id as a key
    s3_client = boto3.client("s3")
    compressed_thumbnail = img_compression(thumbnail)
    compressed_thumbnail.seek(0) # rewind bytesio to 0 pre upload

    # thumbnail upload to s3 static bucket
    thumb_key = f"static/thumbnails/{current_user.id}/TEST1.png"
    s3_client.upload_fileobj(compressed_thumbnail, "edits-static", thumb_key, ExtraArgs={"ContentType": "image/png"})    

    db.session.commit()

    """
    when uploading to s3 check to see what bucket
    the bucket should be the static bucket which is
    called edits-static.

    the url where all thumbnails go will be
    edits/static/thumbnails/edit-id.png or jpg
    """

    logger.info(f"Successfully uploaded a thumbnail.")
    return jsonify({"thumbnail": thumbnail}), 201
