import { useEffect, useState } from "react";
import styles from "./ChatPage.module.css";
import { API_URL } from "../../utils/constants";
import httpClient from "../../utils/httpClient";
import { io } from "socket.io-client";

const URL = import.meta.env.MODE === 'production' ? undefined : API_URL;

const socket = io(API_URL, {
    cors: {
        origin: "http://localhost:5173",
    },
});

function ChatPage() {
    const [isConnected, setIsConnected] = useState(socket.disconnected);
    const [message, setMessage] = useState("");

    useEffect(() => {
        socket.on('connect', (data) => {
            console.log(data);
            setIsConnected(true);
        });

        socket.on('disconnect', (data) => {
            console.log(data);
            setIsConnected(false);
        }); 

        return () => {
            // socket.connected();
        }
    }, []);

    const sendMessage = () => {
        socket.emit("send_message", { message }); // emits an event
        setMessage("");
    };

    return (
        <main>
            <input onChange={(e) => setMessage(e.target.value)} placeholder="Message..." type="text" className={styles.enter} />
            <button onClick={sendMessage} className={styles.send}>Send Message</button>

            <p>WebSocket: {'' + isConnected.toString()}</p>
        </main>
    );
}

export default ChatPage;
