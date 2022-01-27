import React, {
  useContext,
  useState,
  useCallback,
} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Link,
} from '@material-ui/core';
import { useDeepCompareMemo } from 'use-deep-compare';
import { ApplicationStepper, Translatable } from './components/';
import { AppContext } from './App.context';

function Workspace() {
  // this state manage on open validation
  const [criticalErrors, setCriticalErrors] = useState([]);

  const {
    state: {
      sourceRepository,
      filepath,
    },
    actions: { setSourceRepository },
    sourceFile,
  } = useContext(AppContext);

  const sourceFilepath = sourceFile?.state?.filepath;
  const handleClose = useCallback( () => {
    setCriticalErrors([]);
    setSourceRepository(undefined);
  }, [setCriticalErrors, setSourceRepository]);

  const component = useDeepCompareMemo(() => {
    let _component = <ApplicationStepper />;

    if (sourceRepository && sourceFilepath && filepath) {
      if (sourceFilepath === filepath) {
        _component = (
          (criticalErrors.length > 0 &&
            <Dialog
              disableBackdropClick
              open={(criticalErrors.length > 0)}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
              This file cannot be opened by tC Create as there are errors in the target file. 
              Please contact your administrator to address the following error(s)                  
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {
                    criticalErrors.map( (msg,idx) => (
                      <>
                      <Typography key={idx}>
                        On <Link href={msg[0]} target="_blank" rel="noopener">
                          line {msg[1]}
                        </Link>
                        &nbsp;{msg[2]}&nbsp;{msg[3]}&nbsp;{msg[4]}&nbsp;{msg[5]}
                      </Typography>
                      </>
                    ))
                  }
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          )
          ||
          <Translatable />
        );
      }
    }
    return _component;
  }, [sourceRepository, sourceFilepath, filepath, criticalErrors, handleClose]);

  return component;
};

export default Workspace;
