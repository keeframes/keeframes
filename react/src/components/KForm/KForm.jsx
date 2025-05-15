import styles from "./KForm.module.css"


export default function KForm({ data, setData, handleSubmit, children }) {
  const handleChange = (e) => {
    setData((prev) => ({...prev, [e.target.name]: e.target.value}));
  }

  return (
  <>
      <form className={styles.form} onSubmit={handleSubmit}>
        {children}
      </form>
    </>
  )
}
