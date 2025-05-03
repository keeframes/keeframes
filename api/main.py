from app import app
from app.socketio import socketio

# using flask socket to run app instead of default .run() 
# wraps the app in socketio so it can handle web sockets and polling
if __name__ == "__main__":
    socketio.run(app, debug=True, port=8000)
