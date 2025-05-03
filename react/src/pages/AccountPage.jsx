import { useEffect, useState } from "react";
import styles from "../styles/AccountPage.module.css";
import { API_URL } from "../utils/constants";
import httpClient from "../utils/httpClient";
import { io } from "socket.io-client";
import WebSocketCall from "../components/WebSocketCall";

function AccountPage() {
    const [users, setUsers] = useState([]);
    const [socketInstance, setSocketInstance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [buttonStatus, setButtonStatus] = useState(false);
    const [httpData, setHttpData] = useState(null);

    const handleClick = () => {
        setButtonStatus((prev) => !prev);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await httpClient.post(`${API_URL}/http_call`);
                setHttpData(res.data);
            } catch (error) {
                console.error("HTTP call failed:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (buttonStatus) {
            const socket = io("http://localhost:8000", {
                transports: ["websocket"],
            });

            setSocketInstance(socket);

            socket.on("connect", () => {
                console.log("Socket connected:", socket.id);
                setLoading(false);
            });

            socket.on("disconnect", () => {
                console.log("Socket disconnected");
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [buttonStatus]);

    return (
        <main>
            <h1>SOCKET TEST</h1>

            <div className={styles.line}>
                {httpData ? httpData.data : "Loading HTTP data..."}
            </div>

            {!buttonStatus ? (
                <button onClick={handleClick}>CHAT ON</button>
            ) : (
                <>
                    <button onClick={handleClick}>TURN CHAT OFF</button>
                    <div className={styles.line}>
                        {!loading && socketInstance && (
                            <WebSocketCall socket={socketInstance} />
                        )}
                    </div>
                </>
            )}
        </main>
    );
}

export default AccountPage;
