import React, { useContext } from 'react';

import ApplicationStepper from './components/application-stepper/ApplicationStepper';
import Translatable from './components/translatable/Translatable';
import { AppContext } from './App.context';
import { TargetFileContextProvider } from './core/TargetFile.context';  

function Workspace () {
  const {
    state: {
      sourceRepository,
      sourceFile,
      targetFile,
    }
  } = useContext(AppContext);

  let component;
  if (sourceRepository && sourceFile) {
    component = (
      <TargetFileContextProvider>
        <Translatable />
      </TargetFileContextProvider>
    );
  } else {
    component = <ApplicationStepper />;
  }

  return component;
}

export default Workspace;