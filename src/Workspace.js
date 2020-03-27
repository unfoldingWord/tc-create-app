import React, { useContext, useMemo } from 'react';

import ApplicationStepper from './components/application-stepper/ApplicationStepper';
import Translatable from './components/translatable/Translatable';
import { AppContext } from './App.context';
import { TargetFileContextProvider } from './core/TargetFile.context';  

function Workspace () {
  const { state: { sourceRepository, sourceFile, filepath } } = useContext(AppContext);

  const sourceRepoMemo = sourceRepository && JSON.stringify(sourceRepository);
  const sourceFilepath = sourceFile && sourceFile.filepath;

  const component = useMemo(() => {
    let _component = <ApplicationStepper />;
    if (sourceRepoMemo && sourceFilepath && filepath) {
      if (sourceFilepath === filepath) {
        console.log('WorkspaceComponent');
        _component = (
          <TargetFileContextProvider>
            <Translatable />
          </TargetFileContextProvider>
        );
      }
    };
    return _component;
  }, [sourceRepoMemo, sourceFilepath, filepath]);

  return component;
};

export default Workspace;