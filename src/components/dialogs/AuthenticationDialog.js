import React, {
  useContext,
} from 'react';
import {
  useDeepCompareCallback,
  useDeepCompareMemo,
} from 'use-deep-compare';
import {
  Modal,
  Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { LoginForm } from 'gitea-react-toolkit';

import { AppContext } from '../../App.context';

function AuthenticationDialog({
  show,
  open,
  close,
  saveRetry,
}) {
  const classes = useStyles();

  const {
    state: { config },
    targetFile,
  } = useContext(AppContext);

  const autoSaveOnEdit = useDeepCompareCallback( async (content) => {
    //console.log("tC Create / autosave", targetFile, content);
    await targetFile.actions.saveCache(content);
  }, [targetFile.actions]);

  const component = useDeepCompareMemo(() => {
    let _component = <></>;

    if (show) {
      _component = (
        <Modal open={true} onClose={close}>
          <Paper className={classes.modal}>
            <LoginForm
              config={config}
              authentication={null/** Override to simulate logged out. */}
              actionText={'Login to try again...'}
              errorText={'Error! File was not saved.  Connection to the server was lost.'}
              onSubmit={saveRetry}
            />
          </Paper>
        </Modal>
      );
    };
    return _component;
  }, [config, show, classes.modal, autoSaveOnEdit]);

  return component;
};

const useStyles = makeStyles(() => (
  {
    modal: {
      position: 'absolute',
      top: '10%',
      left: '10%',
      right: '10%',
      maxHeight: '80%',
      overflow: 'scroll',
    },
  }
));

export default AuthenticationDialog;
