import React, { useState, useContext, useEffect }from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import useConfirm from '../hooks/useConfirm';
import { TargetFileContext } from '../core/TargetFile.context';
import { FileContext, AuthenticationContext, LoginForm, parseError } from 'gitea-react-toolkit';

const ConfirmDialog = ({ contentIsDirty }) => {
  const [savingTargetFileContent, setSavingTargetFileContent] = useState();
  const [doSaveRetry, setDoSaveRetry] = useState(false);
  const {
    prompt = '',
    isOpen = false,
    proceed,
    cancel,
  } = useConfirm({ contentIsDirty });

  const { state: targetFile, actions: save } = useContext(
    TargetFileContext
  );

  return (
    <Dialog
      open={isOpen}
      onClose={cancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {prompt}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button data-test-id="Ec3EpnUNruInTNmUbFl5e" onClick={cancel} color="primary">
            CANCEL
        </Button>
        <Button data-test-id="ASDE4JeHBc7Sk4G-tyEP7" onClick={proceed} color="primary" autoFocus>
            OK
        </Button>
        {/* <Button data-test-id="ASDE4JeHBc7Sk4G-tyEP7" onClick={saveOnTranslation} color="primary" autoFocus>
            SAVE
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  contentIsDirty: PropTypes.bool,
  promptText: PropTypes.string,
};

export default ConfirmDialog;
