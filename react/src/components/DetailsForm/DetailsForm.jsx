import styles from "./DetailsForm.module.css";

function DetailsForm({ values, setValues }) {
  const handleChange = (e) => {
    e.preventDefault();
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <form className={styles.container}>
      <div className={styles.row}>
        <div className={styles.header}>
          <label className={styles.label} htmlFor="caption">
            Caption
          </label>
          <p className={styles.length}>
            {values.caption ? values.caption.length : 0} / 2000
          </p>
        </div>
        <textarea
          rows="6"
          maxLength="2000"
          name="caption"
          id="caption"
          onChange={handleChange}
          value={values.caption}
        />
      </div>
      <div className={styles.row}>
        <div className={styles.header}>
          <p className={styles.label}>Hashtags</p>
        </div>
      </div>
    </form>
  );
}

export default DetailsForm;
