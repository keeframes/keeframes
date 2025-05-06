import styles from "./IconButton.module.css";

function IconButton({ Icon, children, ...props }) {
  return (
    <button className={styles.container} {...props}>
      <Icon className={styles.icon} />
      {children}
    </button>
  );
}

export default IconButton;
