import React, { useContext, useMemo, useState } from 'react';
import { FileContext } from 'gitea-react-toolkit';
import { ApplicationStepper, Translatable } from './components/';
import { AppContext } from './App.context';
import { TargetFileContextProvider } from './core/TargetFile.context';
import { Typography } from '@material-ui/core';

function Workspace() {
  const [validated, setValidated] = useState(false);
  const [criticalErrors, setCriticalErrors] = useState(['Validating']);
  const { state: { sourceRepository, filepath } } = useContext(AppContext);
  const { state: sourceFile } = useContext(FileContext);

  const sourceRepoMemo = sourceRepository && JSON.stringify(sourceRepository);
  const sourceFilepath = sourceFile && sourceFile.filepath;

  const component = useMemo(() => {
    let _component = <ApplicationStepper />;

    if (sourceRepoMemo && sourceFilepath && filepath) {
      if (sourceFilepath === filepath) {
        _component = (
          <TargetFileContextProvider 
            validated={validated} onValidated={setValidated} 
            onCriticalErrors={setCriticalErrors}
          >
            {(validated && <Translatable />) || 
              criticalErrors.map( msg => {
                return <Typography>{msg}</Typography>
              })
            }
          </TargetFileContextProvider>
        );
      }
    }
    return _component;
  }, [sourceRepoMemo, sourceFilepath, filepath, validated, criticalErrors]);

  return component;
}

export default Workspace;
