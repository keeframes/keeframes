import styles from "./CreateForm.module.css";

function CreateForm({ children }) {
  return <div className={styles.container}>{children}</div>;
}

export default CreateForm;
