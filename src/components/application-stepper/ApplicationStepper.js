import React, { useContext, useEffect } from 'react';
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
import { Authentication, Repositories, Tree } from 'gitea-react-toolkit';

import { LanguageSelect } from '../languages';
import { AppContext } from '../../App.context';

function ApplicationStepper() {
  const classes = useStyles();
  debugger;
  const {
    state: {
      authentication,
      sourceRepository,
      sourceBlob,
      language,
      config: {
        repositoryConfig,
        authenticationConfig,
      }
    },
    actions: {
      setAuthentication,
      setSourceRepository,
      setSourceBlob,
      setLanguage,
    }
  } = useContext(AppContext);

  const [activeStep, setActiveStep] = React.useState(0);
  let completed = {
    0: !!authentication,
    1: !!language,
    2: !!sourceRepository,
    3: !!sourceBlob,
  };

  useEffect(() => {
    let firstIncomplete;
    Object.keys(completed).forEach(step => {
      if (!completed[step] && !firstIncomplete) firstIncomplete = step;
    });
    if (firstIncomplete < activeStep) setActiveStep(firstIncomplete);
  }, [activeStep, completed]);

  const steps = [
    {
      label: 'Login',
      instructions: 'Login to Door43',
      component: () => (
        <Authentication
          authentication={authentication}
          onAuthentication={setAuthentication}
          config={authenticationConfig}
        />
      )
    },
    {
      label: 'Language',
      instructions: 'Select Your Language',
      component: () => (
        <LanguageSelect
          language={language}
          onLanguage={setLanguage}
        />
      )
    },
    {
      label: 'Resource',
      instructions: 'Select Resource to Translate',
      component: () => (
        <Repositories
          config={repositoryConfig}
          urls={repositoryConfig.urls}
          repository={sourceRepository}
          onRepository={setSourceRepository}
        />
      )
    },
    {
      label: 'File',
      instructions: 'Select File to Translate',
      component: () => (
        <Tree
          url={sourceRepository ? sourceRepository.tree_url : null}
          blob={sourceBlob}
          onBlob={setSourceBlob}
          config={authenticationConfig}
          selected={true}
        />
      )
    },
  ];

  const handleNext = () => {
    let newActiveStep;
    const totalSteps = steps.length;
    const isLastStep = activeStep === totalSteps - 1;
    const completedSteps = Object.keys(completed).length;
    const allStepsCompleted = completedSteps === totalSteps;
    if (isLastStep && !allStepsCompleted) {
      // It's the last step, but not all steps have been completed,
      // find the first step that has been completed
      newActiveStep = steps.findIndex((step, i) => !(i in completed));
    } else {
      newActiveStep = parseInt(activeStep) + 1;
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
            {steps[activeStep].component()}
            <Divider className={classes.divider} />
            <div className={classes.buttons}>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
            </Button>
              <Button
                data-test="stepper-next"
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
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: `${theme.spacing(2)}px`,
  },
  step: {
    maxWidth: '600px',
    margin: 'auto',
    padding: `0 ${theme.spacing(2)}px`,
  },
  divider: {
    margin: `${theme.spacing(2)}px 0`,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  completed: {
    display: 'inline-block',
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export default ApplicationStepper;
