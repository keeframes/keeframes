from flask_socketio import SocketIO
from .utils.constants import FRONTEND_URL

# creates an accessible socketio instance 
socketio = SocketIO(cors_allowed_origins=[FRONTEND_URL], logger=True) 
