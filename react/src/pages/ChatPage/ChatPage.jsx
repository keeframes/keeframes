import { useEffect, useState, useRef } from "react";
import styles from "./ChatPage.module.css";
import { API_URL } from "../../utils/constants";
import { useCurrentUser } from "../../hooks/contexts";
import { io } from "socket.io-client";

function ChatPage() {
    const [isConnected, setIsConnected] = useState(false);
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [joinedRoom, setJoinedRoom] = useState(false);
    const { user } = useCurrentUser();
    const socketRef = useRef(null);


    useEffect(() => {
        // Only initialize socket once
        socketRef.current = io(API_URL, {
            autoConnect: false,
            cors: {
                origin: "http://localhost:5173",
            },
        });

        socketRef.current.on("connect", () => {
            setIsConnected(true);
        });

        socketRef.current.on("disconnect", () => {
            setIsConnected(false);
        });

        socketRef.current.on("chat", ({message, username}) => {
            setMessageList((list) => [...list, `${username}: ${message}`]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (socketRef.current && message.trim()) {
            socketRef.current.emit("send_message", { message });
            setMessage("");
        }
    };

    const handleJoin = () => {
        if (joinedRoom) {
            setJoinedRoom(false);
            socketRef.current.disconnect();
        } else {
            setJoinedRoom(true);
            socketRef.current.connect();
            socketRef.current.emit("user_join", user.username);
        }
    };


    return (
        <main>
            {joinedRoom ? (
                <>
                    <div className={styles.chat}>
                        {messageList.map((msg, index) => (
                            <div key={index}>{msg}</div>
                        ))}
                    </div>
                    <input
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        placeholder="Message..."
                        type="text"
                        className={styles.enter}
                    />
                    <button onClick={sendMessage} className={styles.send}>Send Message</button>
                    <button onClick={handleJoin} className={styles.join}>Leave Room</button>
                </>
            ) : (
                <button onClick={handleJoin} className={styles.join}>Join Room</button>
            )}

            <p>WebSocket: {isConnected.toString()}</p>
        </main>
    );
}

export default ChatPage;
