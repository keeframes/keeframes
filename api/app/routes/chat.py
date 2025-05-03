from flask import Blueprint, jsonify, request
from ..socketio import socketio
from flask_socketio import emit

chat = Blueprint("chat", __name__)

@chat.route("/http_call", methods=["POST"])
def http_call():
    data = {"data": "FETCHED TEXT VIA HTTP CALL TO SERVER ON RENDER"}
    return jsonify(data)

# runs when client connects via SocketIO
@socketio.on("connect")
def connected():
    print(request.sid) # session id of connecting sockets
    print("client has connected")
    emit("connect", {"data": f"id: {request.sid} is connected"}) 
    
# triggered via data event -> logs data and broadcasts it to all clients
@socketio.on("data")
def handle_message(data):
    print("data from the front end: ",str(data))
    emit("data",{'data':data,'id':request.sid},broadcast=True)

# triggered on client disconnect
@socketio.on("disconnect")
def disconnected():
    print("user disconnected")
    emit("disconnect",f"user {request.sid} disconnected",broadcast=True)