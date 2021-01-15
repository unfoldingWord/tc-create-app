import React, { useContext, useMemo, useState } from 'react';
import { FileContext } from 'gitea-react-toolkit';
import { ApplicationStepper, Translatable } from './components/';
import { AppContext } from './App.context';
import { TargetFileContextProvider } from './core/TargetFile.context';
import { Typography, Link } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

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
              <Alert severity="error" onClose={() => {
                // not sure what to put here...
              }}>
                <AlertTitle>Error</AlertTitle>
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
                <Typography>Please correct resource or close and select another</Typography>
              </Alert>
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
