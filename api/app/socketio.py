from flask_socketio import SocketIO

# creates an accessible socketio instance 
socketio = SocketIO(cors_allowed_origins=["http://localhost:5173"], logger=True) 
