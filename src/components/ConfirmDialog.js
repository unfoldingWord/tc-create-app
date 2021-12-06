import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { localString } from '../core/localStrings';


const ConfirmDialog = ({
    open, 
    handleClickOpen,
    handleCloseDialog,
    handleCancelClick,
    handleOkClick,
}) => {
 
    const onCancelClick = () => {
        handleCloseDialog();
        handleCancelClick();
    }

    const onOkClick = () => {
        handleCloseDialog();
        handleOkClick();
    }

    return (
        <Dialog
            open={open}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
            {localString('ConfirmCloseWindow')}
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={onCancelClick} color="primary">
            CANCEL
            </Button>
            <Button onClick={onOkClick} color="primary" autoFocus>
                OK
            </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog;