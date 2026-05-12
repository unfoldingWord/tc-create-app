import React, { useContext } from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';
import {
  Button,
  Modal,
  Paper,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { LoginForm } from 'gitea-react-toolkit';

import { AppContext } from '../../App.context';

function AuthenticationDialog({
  show,
  // open,
  close,
  saveRetry,
}) {
  const classes = useStyles();

  const { state: { authentication, config } } = useContext(AppContext);

  const component = useDeepCompareMemo(() => {
    let _component = <></>;

    if (show) {
      _component = (
        <Modal open={true} onClose={close}>
          <Paper className={classes.modal}>
            {/*
              Pass the real authentication object so the LoginForm does not
              display a false "logged out" state when the underlying issue is
              a server-side error rather than an expired session.
              If authentication is null the form correctly shows the login UI.
            */}
            <LoginForm
              config={config}
              authentication={authentication}
              actionText={'Login to try again...'}
              errorText={'Error! File was not saved.  Please log in again and retry.'}
              onSubmit={saveRetry}
            />
            <div className={classes.refreshRow}>
              <Typography variant="body2" className={classes.refreshHint}>
                If re-logging in does not help, the server file may have changed.
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={() => window.location.reload()}
              >
                Refresh page
              </Button>
            </div>
          </Paper>
        </Modal>
      );
    };
    return _component;
  }, [authentication, config, show, classes.modal, classes.refreshRow, classes.refreshHint]);

  return component;
};

const useStyles = makeStyles((theme) => (
  {
    modal: {
      position: 'absolute',
      top: '10%',
      left: '10%',
      right: '10%',
      maxHeight: '80%',
      overflow: 'scroll',
    },
    refreshRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(1, 2, 2),
      gap: theme.spacing(1),
    },
    refreshHint: {
      color: theme.palette.text.secondary,
    },
  }
));

export default AuthenticationDialog;
