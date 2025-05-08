import styles from "./StepBar.module.css";

export default function StepBar({ currentStepIndex, stepNames, goTo }) {
  const isActive = (index) => {
    if (index === currentStepIndex) {
      return `${styles.step} ${styles.active}`
    }
    return `${styles.step} ${styles.notActive}`
  }

  return (<div className={styles.container}>
    {stepNames.map((stepName, index) => (
      <div className={isActive(index)} key={index}>
        <p className={styles.index}>{index}.</p>
        <button onClick={() => goTo(index)}>{stepName}</button>
      </div>
    ))}
  </div>
  )
}
