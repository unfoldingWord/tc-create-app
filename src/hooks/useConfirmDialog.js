const useConfirmDialog = () => {
    const [okToContinue, setOkToContinue] = useState(false);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
      };
    
    const handleCloseDialog = () => {
        setOpen(false);
      };

    const handleConfirmDialog = () => {
        handleClickOpen();

    }

    const handleOkClick = () => {
        setOkToContinue(true);
    }

    return {
        okToContinue, open, handleCloseDialog()
    }
}

export default useConfirmDialog;