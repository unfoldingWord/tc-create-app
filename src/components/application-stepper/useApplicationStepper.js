import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  useDeepCompareCallback,
  useDeepCompareEffect,
  useDeepCompareMemo,
} from 'use-deep-compare';

import { LanguageSelect } from '../languages';
import { getActiveStep, getNextStep } from './helpers';

export default function useApplicationStepper(appContext) {
  const {
    state: { language },
    actions: { setLanguage },
    giteaReactToolkit: {
      authenticationHook,
      organizationHook,
      sourceRepositoryHook,
      sourceFileHook,
    },
  } = appContext;

  const { state: authentication, component: authenticationComponent } = authenticationHook;
  const { state: organization, components: { list: organizationComponent } } = organizationHook;
  const { state: sourceRepository, components: { browse: repositoryComponent } } = sourceRepositoryHook;
  const { state: sourceFileState, component: fileComponent } = sourceFileHook;

  const [activeStep, setActiveStep] = React.useState(0);

  const alreadyCompleted = useDeepCompareMemo(() => ({
    0: !!authentication,
    1: !!organization,
    2: !!sourceRepository,
    3: !!language,
    4: !!sourceFileState,
  }), [authentication, organization, sourceRepository, language, sourceFileState]);

  const [completed, setCompleted] = useState(alreadyCompleted);

  useDeepCompareEffect(() => {
    setCompleted(alreadyCompleted);
  }, [alreadyCompleted]);

  useEffect(() => {
    const newActiveStep = getActiveStep(alreadyCompleted);
    setActiveStep(newActiveStep);
  }, [alreadyCompleted, setActiveStep]);

  const steps = useDeepCompareMemo(() => ([
    {
      label: 'Login',
      instructions: 'Login to Door43',
      component: () => (authenticationComponent),
    },
    {
      label: 'Organization',
      instructions: 'Select Your Organization',
      component: () => (organizationComponent),
    },
    {
      label: 'Resource',
      instructions: 'Select Resource to Translate',
      component: () => (repositoryComponent),
    },
    {
      label: 'Language',
      instructions: 'Select Your Language',
      component: function component() {
        return (<LanguageSelect
          language={language}
          onLanguage={setLanguage}
          organization={organization}
        />);
      },
    },
    {
      label: 'File',
      instructions: 'Select File to Translate',
      component: () => (fileComponent),
    },
  ]), [
    authenticationComponent,
    organizationComponent,
    repositoryComponent,
    language,
    setLanguage,
    organization,
    fileComponent,
  ]);

  const handleNext = useDeepCompareCallback(() => {
    const nextStep = getNextStep({ activeStep, steps, completed })
    setActiveStep(nextStep);
  }, [steps, activeStep, completed]);

  const handleBack = useCallback(() => {
    setActiveStep(activeStep - 1);
  }, [activeStep]);

  const handleStep = useCallback((step) => {
    setActiveStep(step);
  }, []);

  return {
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
  };
};
