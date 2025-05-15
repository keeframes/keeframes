import styles from "./KInput.module.css";

export default function KInput({
  name,
  value,
  onChange,
  label,
  placeholder = "",
  helperText = "",
  error = false,
  type = "text",
  disabled = false,
  required = false,
  span = false,
}) {

  const getClasses = () => {
    let classes = span === true ? styles.span : "";

    if (disabled) {
      classes = classes + " " + styles.disabled
      return classes;
    }

    if (error) {
      classes = classes + " " + styles.error
      return classes;
    }

    return classes;
  }

  return (
    <div className={`${styles.container} ${getClasses()}`}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      <input
        className={styles.input}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
      />
      <p className={styles.helper}>{helperText}</p>
    </div>
  );
}
