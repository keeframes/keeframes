import styles from "./Count.module.css";

export default function Count({ label, number }) {
  return (
    <div className={styles.container}>
      <p className={styles.number}>{number}</p>
      <p className={styles.label}>{label}</p>
    </div>
  );
}
