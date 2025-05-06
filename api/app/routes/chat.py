from flask import Blueprint, jsonify, request
from ..socketio import socketio
from flask_socketio import emit

chat = Blueprint("chat", __name__)

@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    print('-' * 25)
    print(f"Client has connected: {request.sid}")
    emit("connect", {"data": f"id: {request.sid} is connected"})
    print('-' * 25)


@socketio.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    print('-' * 25)
    print("User disconnected")
    emit("disconnect", f"User {request.sid} disconnected", broadcast=True)
    print('-' * 25)
