import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useDeepEffect from 'use-deep-compare-effect';

function ValidateOnOpenDialog(
 {errors}
){
	console.log("ValidateOnOpenDialog with:", errors);
  const [open, setOpen] = React.useState(false);
  const scroll = 'paper';

  const handleClose = () => {
	setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
	if (open) {
	  const { current: descriptionElement } = descriptionElementRef;
	  if (descriptionElement !== null) {
		descriptionElement.focus();
	  }
	}
  }, [open]);

  useDeepEffect( () => {
	console.log("ValidateOnOpenDialog, useDeepEffect, errors=", errors);
	if ( errors && errors.noticeList ) {
		setOpen(true);
	}
  }, [errors]);

  return (
	<div>
	  <Dialog
		open={open}
		onClose={handleClose}
		scroll={scroll}
		aria-labelledby="scroll-dialog-title"
		aria-describedby="scroll-dialog-description"
	  >
		<DialogTitle id="scroll-dialog-title">On Open Validation</DialogTitle>
		<DialogContent dividers={scroll === 'paper'}>
		  <DialogContentText
			id="scroll-dialog-description"
			ref={descriptionElementRef}
			tabIndex={-1}
		  >
			{errors}
		  </DialogContentText>
		</DialogContent>
		<DialogActions>
		  <Button onClick={handleClose} color="primary">
			Close
		  </Button>
		</DialogActions>
	  </Dialog>
	</div>
  );
}

export default ValidateOnOpenDialog;