import React, { useCallback, useContext } from 'react';
import {
  Typography,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
import { AppContext } from '../../App.context';

export default function SourceValidationDialog() {
  const {
    state: { criticalValidationErrors = [] },
    actions: {
      setSourceRepository,
      setCriticalValidationErrors,
    },
  } = useContext(AppContext);

  const handleClose = useCallback(() => {
    setCriticalValidationErrors([]);
    setSourceRepository(undefined);
  }, [setCriticalValidationErrors, setSourceRepository]);

  return (
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
            criticalValidationErrors?.map((msg, idx) => (
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
  );
};