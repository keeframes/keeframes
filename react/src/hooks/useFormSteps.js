import { useState } from "react";

export function useFormSteps(steps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // increments current step index
  const next = () => {
    setCurrentStepIndex((i) => {
      if (i >= steps.length - 1) return;
      return i + 1;
    });
  };

  // decrements the current step index
  const prev = () => {
    setCurrentStepIndex((i) => {
      if (i <= 0) return;
      return i - 1;
    });
  };

  // jumps to an index
  const goTo = (index) => {
    if (index < 0 || index >= steps.length) return;
    setCurrentStepIndex(index);
  };

  return {
    currentStepIndex,
    next,
    prev,
    goTo,
    Step: steps[currentStepIndex],
    isLast: currentStepIndex === steps.length - 1,
    isFirst: currentStepIndex === 0,
  };
}
