import React, { useContext } from 'react';

import ApplicationStepper from './components/application-stepper/ApplicationStepper';
import Translatable from './components/translatable/Translatable';
import { AppContext } from './App.context';

function Workspace () {
  const {
    state: {
      sourceRepository,
      targetRepository,
      sourceFile,
      targetFile,
      language,
      sectionable,
    }
  } = useContext(AppContext);

  let component;
  if (sourceRepository && sourceFile && targetFile) {
    component = (
      <Translatable
        sourceRepository={sourceRepository}
        targetRepository={targetRepository}
        sourceFile={sourceFile}
        targetFile={targetFile}
        language={language}
        sectionable={sectionable}
      />
    );
  } else {
    component = (
      <ApplicationStepper />
    );
  }

  return component;
}

export default Workspace;