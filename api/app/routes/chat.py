from flask import Blueprint, jsonify, request
from ..socketio import socketio
from flask_socketio import emit

chat = Blueprint("chat", __name__)

@chat.route("/http_call", methods=["POST"])
def http_call():
    data = {"data": "FETCHED TEXT VIA HTTP CALL TO SERVER ON RENDER"}
    return jsonify(data)

@socketio.on("connect")
def connected():
    print(request.sid)
    print("client has connected")
    emit("connect", {"data": f"id: {request.sid} is connected"})
    
@socketio.on("data")
def handle_message(data):
    print("data from the front end: ",str(data))
    emit("data",{'data':data,'id':request.sid},broadcast=True)


@socketio.on("disconnect")
def disconnected():
    print("user disconnected")
    emit("disconnect",f"user {request.sid} disconnected",broadcast=True)