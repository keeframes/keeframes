import os
from dotenv import load_dotenv
load_dotenv()

DEBUG = os.environ.get("DEBUG")
FRONTEND_URL = os.environ.get("FRONTEND_URL")
CDN_DOMAIN = os.environ.get("CDN_DOMAIN")
CDN_URL = f"https://{CDN_DOMAIN}"

COGNITO_REGION = os.getenv("COGNITO_REGION")
USER_POOL_ID = os.getenv("USER_POOL_ID")
APP_CLIENT_ID = os.getenv("APP_CLIENT_ID")
JWKS_URL = f'https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USER_POOL_ID}/.well-known/jwks.json'
