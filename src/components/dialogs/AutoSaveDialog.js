import React, { useCallback, useContext } from 'react';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';

import { AppContext } from '../../App.context';
import { removeFileCache } from '../../core/persistence';

export default function AutoSaveDialog() {
  const {
    state: {
      cacheFileKey,
      cacheWarningMessage,
    },
    actions: { setSourceRepository, setCacheWarningMessage, clearCachedFile },
  } = useContext(AppContext);

  const handleClose = useCallback(() => {
    setSourceRepository(undefined);
  }, [setSourceRepository]);

  const handleCloseCachedFile = useCallback(() => {
    // CLEAR cache:
    removeFileCache(cacheFileKey);
    clearCachedFile();
    // Reset dialog:
    setCacheWarningMessage(null);
    // Close current file:
    handleClose();
  }, [cacheFileKey, setCacheWarningMessage, handleClose]);

  return (
    <Dialog
      open={cacheWarningMessage != null}
      onClose={() => setCacheWarningMessage(null)}
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
        <Button
          data-test-id="ShV9tWcn2YMF7Gau"
          color="primary"
          onClick={handleCloseCachedFile}
        >
          Discard My AutoSaved File
        </Button>
        <Button
          data-test-id="5LJPR3YqqPx5Ezkj"
          onClick={() => {// Reset dialog:
            setCacheWarningMessage(null);
          }}
          color="primary"
          autoFocus
        >
          Keep My AutoSaved File
        </Button>
      </DialogActions>
    </Dialog>
  );
};