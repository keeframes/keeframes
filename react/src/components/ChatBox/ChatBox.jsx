import styles from "./ChatBox.module.css";

export default function ChatBox({msgLi}) {
    <div className={styles.chat}>
        {msgLi.map((msg, index) => (
            <div key={index}>{msg}</div>
        ))}
    </div>
}
