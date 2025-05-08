import { useEffect, useState } from "react";
import { useFormSteps } from "../../hooks/useFormSteps";
import AccountForm from "../AccountForm/AccountForm";
import PersonalForm from "../PersonalForm/PersonalForm";
import ProfileForm from "../ProfileForm/ProfileForm";
import StepBar from "../StepBar/StepBar";
import styles from "./SignUpMultiForm.module.css";
import { SignUpProvider } from "../../contexts/SignUpContext";

const INITIAL_DATA = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  fullname: "",
  gender: "",
  age: "",
  pronouns: "",
  pfp: null,
  bio: "",
  software: [],
};

// some keywords
// Step = the current form being displayed (its a react component)
// currentStepIndex = the current index of the current form
// next = next step function
// prev = prev step function
// isFirst = boolean for if its the first step
// isLast = boolean for if its the last step
// goTo = function for jumping between steps

export default function SignUpMultiForm() {
  const [data, setData] = useState(INITIAL_DATA);
  const [error, setError] = useState(null);
  const stepNames = ["Account", "Personal", "Profile"];

  // the controls for controlling all forms (has to pass in each form - in order)
  const stepControls = useFormSteps([AccountForm, PersonalForm, ProfileForm]);

  // dereferencing the controls into specific variables
  const { next, prev, currentStepIndex, Step, isFirst, isLast, goTo } =
    stepControls;

  // REMOVE THIS
  useEffect(() => {
    goTo(1)
  }, [])

  // when the form is submitted
  // (whenever next or submit is pressed)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // every form should have a .validate function which validates its data
      await Step.validate(data);

      // moves onto the next step if if not is last step
      if (!isLast) {
        next();
      }
      // TODO: NEED TO SUBMIT THE FORM HERE
    } catch (error) {
      // sets the error message
      setError(error.message);
    }
  };

  // returns the appropriate buttons based on what form step we are on
  const SignUpButtons = () => {
    // if on first step then only show next button
    if (isFirst) {
      return <button className={styles.next}>Next</button>;
    }
    // if on last step then show submit button instead of next and back button
    else if (isLast) {
      return (
        <>
          <button type="button" onClick={prev} className={styles.prev}>
            Back
          </button>
          <button className={styles.next}>Submit</button>
        </>
      );
    }
    // else show both next button and back button
    else {
      return (
        <>
          <button type="button" onClick={prev} className={styles.prev}>
            Back
          </button>
          <button className={styles.next}>Next</button>
        </>
      );
    }
  };

  // when a button on the left bar is pressed it needs
  // to jump to the index but in a different way compared
  // to the next and back functions
  const jumpTo = async (index) => {
    // if we are pressing the same step then return nothing
    if (index === currentStepIndex) return;

    try {
      // if the chosen step is greater than the current step
      // then we must validate its data
      // this is so that if we go back we dont have to validate the data
      if (index > currentStepIndex) {
        await Step.validate(data);
      }

      // then we go to the current step
      goTo(index);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <SignUpProvider
        data={data}
        setData={setData}
        stepControls={stepControls}
        error={error}
        setError={setError}
      >
        <div className={styles.container}>
          <StepBar
            stepNames={stepNames}
            currentStepIndex={currentStepIndex}
            goTo={jumpTo}
          />
          <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={handleSubmit}>
              {<Step />}
              <div className={styles.buttons}>
                <SignUpButtons />
              </div>
            </form>
          </div>
        </div>
      </SignUpProvider>
    </>
  );
}
