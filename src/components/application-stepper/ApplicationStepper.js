import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Stepper,
  Step,
  StepButton,
  Button,
  Typography,
  Paper,
} from '@material-ui/core';
import { Authentication, Repositories } from 'gitea-react-toolkit';

import { LanguageSelect } from '../languages';

function ApplicationStepper({
  classes,
  authentication,
  onAuthentication,
  authenticationConfig,
  originalRepository,
  onOriginalRepository,
  repositoryConfig,
  language,
  onLanguage,
}) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  const getSteps = () => {
    return [
      {
        label: 'Language',
        instructions: 'Select Your Language',
        component: (
          <LanguageSelect
            language={language}
            onLanguage={onLanguage}
          />
        )
      },
      {
        label: 'Resource',
        instructions: 'Select Resource to Translate',
        component: (
          <Repositories
            config={repositoryConfig}
            urls={repositoryConfig.urls}
            repository={originalRepository}
            onRepository={onOriginalRepository}
          />
        )
      },
      {
        label: 'Login',
        instructions: 'Login to Door43',
        component: (
          <Authentication
            authentication={authentication}
            onAuthentication={onAuthentication}
            config={authenticationConfig}
          />
        )
      },
      {
        label: 'Repository',
        instructions: 'Select or Create Translation Repository',
        component: (
          <>Step 4</>
        )
      },
    ];
  }

  const steps = getSteps();

  const totalSteps = () => steps.length;
  const completedSteps = () => Object.keys(completed).length;
  const isLastStep = () => activeStep === totalSteps() - 1;
  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = () => {
    let newActiveStep;
    if (isLastStep() && !allStepsCompleted()) {
      // It's the last step, but not all steps have been completed,
      // find the first step that has been completed
      newActiveStep = steps.findIndex((step, i) => !(i in completed));
    } else {
      newActiveStep = activeStep + 1;
    }
    setActiveStep(newActiveStep);
  }
  const handleBack = () => setActiveStep(activeStep - 1);
  const handleStep = step => () => setActiveStep(step);
  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  }

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  }

  return (
    <Paper>
    <div className={classes.root}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepButton onClick={handleStep(index)} completed={completed[index]}>
              {step.label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
              Step {activeStep + 1}: {steps[activeStep].instructions}
            </Typography>
            {steps[activeStep].component}
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                Next
              </Button>
              {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography variant="caption" className={classes.completed}>
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <Button variant="contained" color="primary" onClick={handleComplete}>
                    {completedSteps() === totalSteps() - 1 ? 'Finish' : 'Complete Step'}
                  </Button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </Paper>
  );
}

const styles = theme => ({
  root: {
    padding: '1em',
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  completed: {
    display: 'inline-block',
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

export default withStyles(styles)(ApplicationStepper);
