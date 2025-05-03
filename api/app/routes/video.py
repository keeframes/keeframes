import boto3
from flask import jsonify, request, Blueprint
from flask_login import login_required, current_user
from ..utils.video import sign_video_url
from ..models.video import Video
from ..models.extensions import db

video = Blueprint("video", __name__)


@video.route("/video/<id>", methods=["GET"])
def get_video(id):
    try:
        video = Video.query.get({"id": id})

        if not video:
            message = f"video with id: {id} could not be found"
            return jsonify({"error": message}), 400

    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"error": "Internal server error occured"}), 500

    return jsonify(video.to_json()), 200


@video.route("/videos", methods=["GET"])
def get_videos():
    try:
        # get all videos
        videos = Video.query.all()
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"error": "Internal server error occured"}), 500

    return jsonify({"videos": [video.to_json() for video in videos]}), 200


@video.route("/video", methods=["POST"])
@login_required
def create_video():
    video = request.files.get("video")
    caption = request.form.get("caption")

    try:
        # add edit to a database
        edit = Video(caption=caption, user=current_user)
        db.session.add(edit)
        db.session.commit()

        # upload video object to s3 using video id and user id as a key
        s3_client = boto3.client("s3")
        object_name = f"{current_user.id}/{edit.id}"
        response = s3_client.upload_fileobj(video, "edits-dev", object_name)
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"error": "Error"}), 500

    return jsonify({"message": "success"}), 200
