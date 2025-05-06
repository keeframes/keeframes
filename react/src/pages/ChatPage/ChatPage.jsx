import { useEffect, useState } from "react";
import styles from "./ChatPage.module.css";
import { API_URL } from "../../utils/constants";
import httpClient from "../../utils/httpClient";
import { io } from "socket.io-client";

const URL = import.meta.env.MODE === 'production' ? undefined : API_URL;

const socket = io(API_URL, {
    cors: {
        origin: API_URL,
    },
});

function ChatPage() {
    const [isConnected, setIsConnected] = useState(socket.disconnected);

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
            socket.disconnect();
        }
    }, []);

    const sendMessage = (data) => {
        socket.emit("message", { "MESSAGE": data }); // emits an event
    };

    return (
        <main>
            <input placeholder="Message..." type="text" className={styles.enter} />
            <button onClick={sendMessage} className={styles.send}>Send Message</button>

            <p>WebSocket: {'' + isConnected.toString()}</p>
        </main>
    );
}

export default ChatPage;
