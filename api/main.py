from app import app
from app.socketio import socketio

if __name__ == "__main__":
    socketio.run(app, debug=True, port=8000)
