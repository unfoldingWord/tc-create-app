import React, { useContext } from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';
import { makeStyles } from '@material-ui/core/styles';
import {
  Stepper,
  Step,
  StepButton,
  Button,
  Typography,
  Paper,
  Divider,
} from '@material-ui/core';

import { AppContext } from '../../App.context';
import useApplicationStepper from './useApplicationStepper';
import NetlifyBadge from './NetlifyBadge';

function ApplicationStepper() {
  const classes = useStyles();

  const {
    state,
    actions,
    giteaReactToolkit,
  } = useContext(AppContext);

  const {
    state: {
      activeStep,
      steps,
      completed,
    },
    actions: {
      handleBack,
      handleStep,
      handleNext,
    },
  } = useApplicationStepper({
    state,
    actions,
    giteaReactToolkit,
  });

  const stepsComponent = useDeepCompareMemo(() => (
    steps.map((step, index) => (
      <Step key={step.label}>
        <StepButton
          data-test-id={`step-button-${step.label}`}
          onClick={() => handleStep(index)}
          completed={completed[index]}
        >
          {step.label}
        </StepButton>
      </Step>
    ))
  ), [steps, completed]);

  if (steps[activeStep]) {
    return (
      <>
        <Paper>
          <div className={classes.root}>
            <Stepper activeStep={activeStep}>
              {stepsComponent}
            </Stepper>
            <div>
              <div className={classes.step}>
                <Typography variant="h5" className={classes.instructions}>
                  Step {activeStep + 1}: {steps[activeStep].instructions}
                </Typography>
                <Divider className={classes.divider} />
                {steps[activeStep].component()}
                <Divider className={classes.divider} />
                <div className={classes.buttons}>
                  <Button
                    data-test-id="stepper-back"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    data-test-id="stepper-next"
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                    disabled={!completed[activeStep] || activeStep === steps.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Paper>
        <NetlifyBadge />
      </>
    );
  } else {
    return <div />;
  };
};

const useStyles = makeStyles(theme => ({
  root: { padding: `${theme.spacing(2)}px` },
  step: {
    maxWidth: '600px',
    margin: 'auto',
    padding: `0 ${theme.spacing(2)}px`,
  },
  divider: { margin: `${theme.spacing(2)}px 0` },
  buttons: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  button: { marginRight: theme.spacing(1) },
  completed: { display: 'inline-block' },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export default ApplicationStepper;
