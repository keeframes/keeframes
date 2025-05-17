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
  span = 1,
}) {

  const getClasses = () => {
    let classes = "";

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
    <div className={`${styles.container} ${getClasses()}`} style={{
      gridColumn: `span ${span}`
    }}>
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
