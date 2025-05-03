import boto3
from flask import jsonify, request, Blueprint
from flask_login import login_required, current_user
from ..utils.edit import sign_edit_url
from ..models.edit import Edit
from ..models.extensions import db

edit = Blueprint("edit", __name__)


@edit.route("/edit/<id>", methods=["GET"])
def get_edit(id):
    try:
        edit = Edit.query.get({"id": id})

        if not edit:
            message = f"edit with id: {id} could not be found"
            return jsonify({"error": message}), 400

    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"error": "Internal server error occured"}), 500

    return jsonify(edit.to_json()), 200


@edit.route("/edits", methods=["GET"])
def get_edits():
    try:
        # get all edits
        edits = Edit.query.all()
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"error": "Internal server error occured"}), 500

    return jsonify({"edits": [edit.to_json() for edit in edits]}), 200


@edit.route("/edit", methods=["POST"])
@login_required
def create_edit():
    edit = request.files.get("edit")
    caption = request.form.get("caption")

    try:
        # add edit to a database
        edit = Edit(caption=caption, user=current_user)
        db.session.add(edit)
        db.session.commit()

        # upload edit object to s3 using edit id and user id as a key
        s3_client = boto3.client("s3")
        object_name = f"{current_user.id}/{edit.id}"
        response = s3_client.upload_fileobj(edit, "edits-dev", object_name)
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"error": "Error"}), 500

    return jsonify({"message": "success"}), 200
