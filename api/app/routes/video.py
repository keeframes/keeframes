import boto3
from flask import jsonify, request, Blueprint
from flask_login import login_required, current_user
from ..utils.video import sign_video_url
from ..models.video import Video
from ..models.extensions import db

video = Blueprint("video", __name__)


@video.route("/video/<user>/<video>", methods=["GET"])
def get_video_url(user, video):
    signed_url = sign_video_url(user, video)

    return jsonify({"url": signed_url}), 200


@video.route("/videos", methods=["GET"])
def get_videos():
    # get all videos
    videos = Video.query.all()

    # signs each url for each video in the database
    signed_urls = []
    for video in videos:
        signed_url = sign_video_url(video.user_id, video.id)
        signed_urls.append(signed_url)

    return jsonify({"urls": signed_urls}), 200


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
