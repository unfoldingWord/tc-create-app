export const getActiveStep = (completed) => {
  const stepValues = Object.values(completed);
  const firstIncompleteStep = stepValues.findIndex((_, index) => {
    return !stepValues[index];
  });
  const newActiveStep = firstIncompleteStep === -1 ? stepValues.length : firstIncompleteStep;
  return newActiveStep;
};

export const getNextStep = ({ activeStep, steps, completed }) => {
  let nextStep;

  const totalSteps = steps.length;
  const isLastStep = activeStep === totalSteps - 1;
  const completedSteps = Object.keys(completed).length;
  const allStepsCompleted = completedSteps === totalSteps;

  if (isLastStep && !allStepsCompleted) {
    // It's the last step, but not all steps have been completed,
    // find the first step that has been completed
    nextStep = steps.findIndex((_, i) => !(i in completed));
  } else {
    nextStep = parseInt(activeStep) + 1;
  };

  return nextStep;
};