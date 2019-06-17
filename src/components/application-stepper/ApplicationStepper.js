import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Stepper,
  Step,
  StepButton,
  Button,
  Typography,
  Paper,
  Divider,
} from '@material-ui/core';
import { Authentication, Repositories, Tree } from 'gitea-react-toolkit';

import { LanguageSelect } from '../languages';

function ApplicationStepper({
  classes,
  authentication,
  onAuthentication,
  authenticationConfig,
  originalRepository,
  onOriginalRepository,
  repositoryConfig,
  originalBlob,
  onOriginalBlob,
  originalFile,
  language,
  onLanguage,
}) {
  const [activeStep, setActiveStep] = React.useState(0);
  const completed = {
    0: !!language,
    1: !!originalRepository,
    2: !!authentication,
    3: !!originalFile,
  };
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
        label: 'File',
        instructions: 'Select File to Translate',
        component: (
          <Tree
            url={originalRepository ? originalRepository.tree_url : null}
            blob={originalBlob}
            onBlob={onOriginalBlob}
            config={authenticationConfig}
            selected={true}
          />
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
        <div className={classes.step}>
          <Typography variant="h5" className={classes.instructions}>
            Step {activeStep + 1}: {steps[activeStep].instructions}
          </Typography>
          <Divider className={classes.divider} />
          {steps[activeStep].component}
          <Divider className={classes.divider} />
          <div className={classes.buttons}>
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
          </div>
        </div>
      </div>
    </div>
    </Paper>
  );
}

const styles = theme => ({
  root: {
    padding: '1em',
  },
  step: {
    maxWidth: '40em',
    margin: 'auto',
    padding: '0 2.5em',
  },
  divider: {
    margin: '1em 0',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-around',
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
