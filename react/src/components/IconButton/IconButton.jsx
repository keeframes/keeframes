import styles from "./IconButton.module.css"

function IconButton({ Icon, text, onClick }) {
  return <button className={styles.container} onClick={onClick}>
    <Icon className={styles.icon}/>
    {text}
  </button>
}

export default IconButton;
