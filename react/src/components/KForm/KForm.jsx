import useForm from "../../hooks/useForm";
import KInput from "../KInput/KInput";
import styles from "./KForm.module.css";

export default function KForm({
  name,
  header,
  description,
  fields,
  onSubmit,
  style = "box",
  footer,
  children,
  columns = 1,
}) {
  const { values, handleChange } = useForm(name);

  const getStyles = () => {
    const formStyles = ["box"];

    if (formStyles.includes("box")) {
      return styles.box;
    } else {
      throw new Error(style + ": Is not a valid style for a form");
    }
  };

  return (
    <>
      <div className={`${styles.wrapper} ${getStyles()}`}>
        <div className={styles.container}>
          <h3>{header}</h3>
          {description}
          <form
            className={styles.form}
            onSubmit={onSubmit}
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {fields.map((field, index) => (
              <KInput
                key={index}
                {...field}
                value={values[field.name] || ""}
                onChange={handleChange}
              />
            ))}
            {children}
            <div className={styles.footer} style={{
              gridColumn: `span ${columns}`
            }}>{footer}</div>
          </form>
        </div>
      </div>
    </>
  );
}
