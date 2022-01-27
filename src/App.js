import React, {
  useContext, useState, useCallback, useEffect,
} from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Headroom from 'react-headroom';
import { ApplicationBar } from 'gitea-react-toolkit';

import {
  Typography, Link, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from '@material-ui/core';
import { useBeforeunload } from 'react-beforeunload';
import { DrawerMenu } from './components/';

import {
  loadState,
  loadAuthentication,
  removeFileCache,
} from './core/persistence';

import Workspace from './Workspace';
import ConfirmDialog from './components/ConfirmDialog';

import theme from './theme';

import { AppContext, AppContextProvider } from './App.context';
import ConfirmContextProvider from './context/ConfirmContextProvider';
import { getCommitHash } from './utils';
import { localString } from './core/localStrings';

const { version } = require('../package.json');
const commitHash = getCommitHash();
const title = `translationCore Create - v${version}`;

function AppComponent() {
  const {
    state: {
      fontScale,
      contentIsDirty,
      cacheFileKey,
      filepath,
      criticalValidationErrors=[],
      cacheWarningMessage,
    },
    actions: {
      setSourceRepository,
      setCriticalValidationErrors,
      setCacheWarningMessage,
    },
    auth,
    sourceRepo,
    sourceFile,
  } = useContext(AppContext);

  const drawerMenu = <DrawerMenu commitHash={commitHash} />;

  const handleClose = useCallback( () => {
    setCriticalValidationErrors([]);
    setSourceRepository(undefined);
  }, [setCriticalValidationErrors, setSourceRepository]);

  const handleCloseCachedFile = useCallback( () => {
    // CLEAR cache:
    removeFileCache(cacheFileKey);
    // Reset dialog:
    setCacheWarningMessage(null);
    // Close current file:
    handleClose();
  }, [cacheFileKey, setCacheWarningMessage, handleClose]);

  useBeforeunload((event) => {
    if (contentIsDirty) {
      event.preventDefault();
      event.returnValue = localString('ConfirmCloseWindow');
      return localString('ConfirmCloseWindow');
    }
  });

  const onHeadroomPin = () => {
    const el = document.querySelector('#translatableComponent div div[role=\'toolbar\']');

    if (el) {
      el.style.top = '64px';
    }
  };

  const onHeadroomUnfix = () => {
    const el = document.querySelector('#translatableComponent div div[role=\'toolbar\']');

    if (el) {
      el.style.top = '0px';
    }
  };

  const onHeadroomUnpin = () => {
    const el = document.querySelector('#translatableComponent div div[role=\'toolbar\']');

    if (el) {
      el.style.top = '0px';
    }
  };

  const style = {
    app: { fontSize: `${fontScale / 100}em` },
    headroom: { zIndex: '200' },
    workspace: { margin: `${theme.spacing(2)}px` },
  };
  return (
    <div className='App' style={style.app}>
      <MuiThemeProvider theme={theme}>
        {
          (criticalValidationErrors.length > 0 &&
          <Dialog
            disableBackdropClick
            open={(criticalValidationErrors.length > 0)}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
            This file cannot be opened by tC Create as there are errors in the Master file.
            Please contact your administrator to address the following error(s)
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {
                  criticalValidationErrors?.map( (msg,idx) => (
                    <>
                    <Typography key={idx}>
                      On <Link href={msg[0]} target="_blank" rel="noopener">
                        line {msg[1]}
                      </Link>
                      &nbsp;{msg[2]}&nbsp;{msg[3]}&nbsp;{msg[4]}&nbsp;{msg[5]}
                    </Typography>
                    </>
                  ))}
                <br />
                <Typography key="footer" >Please take a screenshot and contact your administrator.</Typography>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button data-test-id="h5wiHB7uHFsQeEy-l5eWL" onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
          )
        ||
        (
          <>
          <Headroom pinStart={64} style={style.headroom}
            onPin={()=>{
              onHeadroomPin();
            }} onUnfix={()=>{
              onHeadroomUnfix();
            }} onUnpin={()=>{
              onHeadroomUnpin();
            }}
          >
            <header id='App-header'>
              <ApplicationBar
                title={title}
                build={commitHash}
                // buttons={buttons}
                drawerMenu={drawerMenu}
                filepath={filepath}
                auth={auth}
                repo={sourceRepo}
                file={sourceFile}
              />
            </header>
          </Headroom>
          <div id='Workspace-Container' style={style.workspace}>
            <Workspace />
          </div>
          </>
        )
        }
        <ConfirmDialog contentIsDirty={contentIsDirty || cacheWarningMessage} />
        <Dialog
          open={cacheWarningMessage != null}
          onClose={()=>setCacheWarningMessage(null)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Your file was autosaved, but the file was later edited by another process...
              <p><pre>{cacheWarningMessage}</pre></p>
              Do you want to keep or discard this file?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button data-test-id="ShV9tWcn2YMF7Gau" color="primary" onClick={handleCloseCachedFile}>
                Discard My AutoSaved File
            </Button>
            <Button data-test-id="5LJPR3YqqPx5Ezkj" onClick={()=>{
              // Reset dialog:
              setCacheWarningMessage(null);
            }} color="primary" autoFocus>
                Keep My AutoSaved File
            </Button>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    </div>
  );
};

function App(props) {
  const [resumedState, setResumedState] = useState();

  const resumeState = useCallback(async () => {
    // note that the authentication context manages its own
    // state via provided persistence load and save closures
    const authentication = await loadAuthentication('authentication');

    const organization = authentication && (await loadState('organization'));
    const language = authentication && (await loadState('language'));
    const sourceRepository =
      authentication && (await loadState('sourceRepository'));
    const resourceLinks = authentication && (await loadState('resourceLinks'));
    const filepath = authentication && (await loadState('filepath'));
    const _resumedState = {
      authentication,
      language,
      sourceRepository,
      filepath,
      organization,
      resourceLinks,
    };
    setResumedState(_resumedState);
  }, []);

  useEffect(() => {
    resumeState();
  }, [resumeState]);

  const _props = { ...props, ...resumedState };

  return !resumedState ? (
    <></>
  ) : (
    <ConfirmContextProvider>
      <AppContextProvider {..._props}>
        <AppComponent {...props} />
      </AppContextProvider>
    </ConfirmContextProvider>
  );
}

export default App;
