from flask import Blueprint, jsonify, request
from ..socketio import socketio
from flask_socketio import emit, send

chat = Blueprint("chat", __name__)

users = {}

@socketio.on("connected")
def handle_connect():
    """event listener when client connects to the server"""
    print('-' * 25)
    print(f"Client has connected: {request.sid}")
    emit("connected", {"data": f"id: {request.sid} is connected"})
    print('-' * 25)

@socketio.on("user_join")
def handle_user_join(username):
    print(f"user {username} joined")
    users[username] = request.sid 

@socketio.on("send_message")
def handle_send(message):
    print(f"new message: {message}")
    username = None
    for user in users:
        if users[user] == request.sid:
            username = user
    emit("chat", {"message": message, "username": username}, broadcast=True)

@socketio.on("disconnected")
def handle_disconnect():
    """event listener when client disconnects to the server"""
    print('-' * 25)
    print("User disconnected")
    emit("disconnected", f"User {request.sid} disconnected", broadcast=True)
    print('-' * 25)

