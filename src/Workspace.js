import React, { useContext, useMemo } from 'react';
import { FileContext } from 'gitea-react-toolkit';
import { ApplicationStepper, Translatable } from './components/';
import { AppContext } from './App.context';
import { TargetFileContextProvider } from './core/TargetFile.context';

function Workspace() {
  const { state: { sourceRepository, filepath } } = useContext(AppContext);
  const { state: sourceFile } = useContext(FileContext);

  const sourceRepoMemo = sourceRepository && JSON.stringify(sourceRepository);
  const sourceFilepath = sourceFile && sourceFile.filepath;

  const component = useMemo(() => {
    let _component = <ApplicationStepper />;

    if (sourceRepoMemo && sourceFilepath && filepath) {
      if (sourceFilepath === filepath) {
        _component = (
          <TargetFileContextProvider>
            <Translatable />
          </TargetFileContextProvider>
        );
      }
    }
    return _component;
  }, [sourceRepoMemo, sourceFilepath, filepath]);

  return component;
}

export default Workspace;
