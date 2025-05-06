from flask import Blueprint, jsonify, request
from ..socketio import socketio
from flask_socketio import emit, send

chat = Blueprint("chat", __name__)

@socketio.on("connected")
def connected():
    """event listener when client connects to the server"""
    print('-' * 25)
    print(f"Client has connected: {request.sid}")
    emit("connected", {"data": f"id: {request.sid} is connected"})
    print('-' * 25)

@socketio.on('send_message')
def handle_message(message):
    print(message)
    send(message)

@socketio.on("disconnected")
def disconnected():
    """event listener when client disconnects to the server"""
    print('-' * 25)
    print("User disconnected")
    emit("disconnected", f"User {request.sid} disconnected", broadcast=True)
    print('-' * 25)
