import styles from "./KButton.module.css";

export default function KButton({
  children,
  onClick = null,
  variant = "normal",
  disabled = false,
  size = "large",
  TailIcon = null,
  LeadIcon = null,
  span = 1,
  type = "button"
}) {
  const getClasses = () => {
    let classes = "";

    if (disabled) {
      classes = styles.disabled;
    }

    // button type
    if (!["normal", "accent", "destructive"]) {
      throw new Error(`${variant} is not a valid button type`);
    }
    classes = classes + " " + styles[variant];

    // button sizing
    if (!["small", "medium", "large"].includes(size)) {
      throw new Error(`${size} is not a valid button size`);
    }
    classes = classes + " " + styles[size];

    return classes;
  };


  return (
    <button
      className={`${styles.button} ${getClasses()}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      style={{
        gridColumn: `span ${span}`
      }}
    >
      {TailIcon ? <TailIcon/> : null}
      <p>
        {children}
      </p>
      {LeadIcon ? <LeadIcon/> : null}
    </button>
  );
}
