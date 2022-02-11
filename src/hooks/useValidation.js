import React, {
  useCallback,
  useContext,
} from 'react';

import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';

import { AppContext } from '../App.context';
import { downloadValidationResults, onValidate } from './validationHelpers';

export default function useValidation({ delimiters }) {
  // manage the state of the resources for the provider context
  const [open, setOpen] = React.useState(false);

  const {
    state: {
      validationPriority,
      organization,
    },
    giteaReactToolkit: { targetFileHook },
  } = useContext(AppContext);

  const { name: targetFileName, content: targetContent } = targetFileHook.state || {};

  const handleClose = useCallback( () => {
    setOpen(false);
  }, [setOpen]);

  const _onValidate = useCallback( async (rows) => {
    setOpen(true);
    const validationResultData = await onValidate({
      targetFileName,
      targetContent,
      delimiters,
      organization,
      validationPriority,
      rows,
    });

    setOpen(false);
    downloadValidationResults({ targetFileName, validationResultData });

    if ( validationResultData.length < 2 ) {
      alert('No Validation Errors Found');
    };
  }, [delimiters, organization, targetContent, targetFileName, validationPriority]);

  let component = <></>;

  if (open) {
    component = (
      <Dialog
        disableBackdropClick
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Validation Running, Please Wait'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div style={{ textAlign: 'center' }}>
              <CircularProgress />{' '}
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return {
    actions: { onValidate: _onValidate },
    component,
  };
};