import boto3
from flask import Flask, jsonify, request, make_response, Blueprint
from datetime import datetime, timedelta
from ..utils.cloudfront import CloudFrontUtil

video = Blueprint("video", __name__)


@video.route("/video/<key>")
def get_video_url(key):
    # expiry time
    expires_at = datetime.now() + timedelta(hours=1)

    # pass in private key secret name and public key id
    cfu = CloudFrontUtil("cf-private-1", "K3LWK7UJYZTKK1")

    # the video in cloudfront
    url = f"https://d35x6vjrwluk3o.cloudfront.net/{key}"

    # the signed url
    signed_url = cfu.generate_presigned_url(url, expires_at)

    return jsonify({"url": signed_url})
