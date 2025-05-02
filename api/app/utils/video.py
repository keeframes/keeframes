from datetime import datetime, timedelta
from ..utils.cloudfront import CloudFrontUtil


def sign_video_url(user, video):
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

    return signed_url
