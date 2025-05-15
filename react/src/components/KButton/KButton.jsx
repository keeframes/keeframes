import styles from "./KButton.module.css";

export default function KButton({
  children,
  onClick = null,
  variant = "normal",
  disabled = false,
  size = "large",
  TailIcon = null,
  LeadIcon = null,
  span = false,
  type = "button"
}) {
  const getClasses = () => {
    let classes = "";

    if (disabled) {
      classes = styles.disabled;
    }

    if (span) {
      classes = classes + " " + styles.span
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
    >
      {TailIcon ? <TailIcon/> : null}
      {children}
      {LeadIcon ? <LeadIcon/> : null}
    </button>
  );
}
