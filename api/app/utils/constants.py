import os
from dotenv import load_dotenv
load_dotenv()

DEBUG = os.environ.get("DEBUG")
FRONTEND_URL = os.environ.get("FRONTEND_URL")
CDN_DOMAIN = os.environ.get("CDN_DOMAIN")
CDN_URL = f"https://{CDN_DOMAIN}"
