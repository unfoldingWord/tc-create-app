import React, { useContext } from 'react';
import { CircularProgress } from '@material-ui/core';
import { useDeepCompareMemo } from 'use-deep-compare';
import { ApplicationStepper, Translatable } from './components/';
import { AppContext } from './App.context';
import CriticalValidationErrorsDialog from './components/dialogs/CriticalValidationErrorsDialog';

function Workspace() {
  const {
    state: { filepath, criticalValidationErrors },
    targetFile,
    sourceFile,
  } = useContext(AppContext);

  const component = useDeepCompareMemo(() => {
    let _component = <ApplicationStepper />;

    const progressComponent = (
      <div style={{ textAlign: 'center' }}>
        <CircularProgress />{' '}
      </div>
    );

    if (sourceFile?.state?.filepath && targetFile?.state?.filepath && targetFile?.state?.content && filepath) {
      if (targetFile.state.filepath === filepath) {
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
  }, [sourceFile, targetFile, filepath, criticalValidationErrors]);

  return component;
};

export default Workspace;
