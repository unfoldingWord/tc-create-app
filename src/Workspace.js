import React, { useContext } from 'react';
import { CircularProgress } from '@material-ui/core';
import { useDeepCompareMemo } from 'use-deep-compare';
import { ApplicationStepper, Translatable } from './components/';
import { AppContext } from './App.context';
import CriticalValidationErrorsDialog from './components/dialogs/CriticalValidationErrorsDialog';

function Workspace() {
  const {
    state: { filepath, criticalValidationErrors },
    giteaReactToolkit: {
      sourceFileHook,
      targetFileHook,
    },
  } = useContext(AppContext);

  const { filepath: sourceFilepath } = sourceFileHook.state || {};
  const { filepath: targetFilepath, content: targetContent } = targetFileHook.state || {};

  const component = useDeepCompareMemo(() => {
    let _component = <ApplicationStepper />;

    const progressComponent = (
      <div style={{ textAlign: 'center' }}>
        <CircularProgress />{' '}
      </div>
    );

    if (sourceFilepath && targetFilepath && targetContent && filepath) {
      if (targetFilepath === filepath) {
        if (criticalValidationErrors.length > 0) {
          // target file validation errors
          _component = <CriticalValidationErrorsDialog />;
        } else {
          _component = <Translatable />;
        };
      } else {
        _component = progressComponent;
      };
    } else if (filepath) {
      _component = progressComponent;
    };
    return _component;
  }, [
    sourceFilepath,
    targetFilepath,
    filepath,
    targetContent,
    criticalValidationErrors,
  ]);

  return component;
};

export default Workspace;
