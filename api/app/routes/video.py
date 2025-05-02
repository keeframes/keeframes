import boto3
from flask import Flask, jsonify, request, make_response, Blueprint
from flask_login import login_required, current_user
from datetime import datetime, timedelta
from ..utils.cloudfront import CloudFrontUtil
from ..models import db, Video

video = Blueprint("video", __name__)


@video.route("/video/<user>/<video>", methods=["GET"])
def get_video_url(user, video):
    # expiry time
    expires_at = datetime.now() + timedelta(hours=1)

    # combine the user and the video
    key = f"{user}/{video}"

    # pass in private key secret name and public key id
    cfu = CloudFrontUtil("cf-private-1", "K3LWK7UJYZTKK1")

    # the video in cloudfront
    url = f"https://d35x6vjrwluk3o.cloudfront.net/{key}"

    # the signed url
    signed_url = cfu.generate_presigned_url(url, expires_at)

    return jsonify({"url": signed_url})


@video.route("/video", methods=["POST"])
@login_required
def create_video():
    video = request.files.get("video")
    caption = request.form.get("caption")

    try:
        edit = Video(caption=caption, user=current_user)
        db.session.add(edit)
        db.session.commit()

        s3_client = boto3.client("s3")
        object_name = f"{current_user.id}/{edit.id}"
        response = s3_client.upload_fileobj(video, "edits-dev", object_name)
        print(response)
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"error": "Error"}), 500

    return jsonify("success")
