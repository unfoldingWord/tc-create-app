import React, { useContext, useMemo, useState } from 'react';
import { FileContext } from 'gitea-react-toolkit';
import { ApplicationStepper, Translatable } from './components/';
import { AppContext } from './App.context';
import { TargetFileContextProvider } from './core/TargetFile.context';
import { Typography, Link } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

function Workspace() {
  const [validated, setValidated] = useState(false);
  const [criticalErrors, setCriticalErrors] = useState([]);
  const { 
    state: { sourceRepository, filepath }, 
    actions: { setSourceRepository} 
  } = useContext(AppContext);
  // note: in above I tried to use setFilepath for use in the Alert
  // onClose() below, but did not work. However, setSourceRepository does
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
            {
              (validated && <Translatable />) 
              || 
              (criticalErrors.length > 0 && 
                <Alert severity="error" onClose={() => {
                  setCriticalErrors([]);
                  setSourceRepository(undefined);
                }}>
                  <AlertTitle>This file cannot be opened by tC Create. Please contact your administrator to address the following error(s).</AlertTitle>
                  {
                    criticalErrors.map( (msg,idx) => {
                      return (
                        <>
                        <Typography key={idx}>
                          On <Link href={msg[0]} target="_blank" rel="noopener">
                            line {msg[1]}
                          </Link>
                          &nbsp;{msg[2]}&nbsp;{msg[3]}&nbsp;{msg[4]}&nbsp;{msg[5]}
                        </Typography>
                        </>
                      )
                  })}
                </Alert>
              )
            }
          </TargetFileContextProvider>
        );
      }
    }
    return _component;
  }, [sourceRepoMemo, sourceFilepath, filepath, validated, criticalErrors, setSourceRepository]);

  return component;
}

export default Workspace;
