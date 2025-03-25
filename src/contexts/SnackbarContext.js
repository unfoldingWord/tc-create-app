import React from 'react';
import { SnackbarProvider } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  snackbar: {
    '& .SnackbarContent-root': {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
    '& .SnackbarItem-variantSuccess': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.success.contrastText,
    },
    '& .SnackbarItem-variantError': {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
    '& .SnackbarItem-variantWarning': {
      backgroundColor: theme.palette.warning.main,
      color: theme.palette.warning.contrastText,
    },
    '& .SnackbarItem-variantInfo': {
      backgroundColor: theme.palette.info.main,
      color: theme.palette.info.contrastText,
    },
  },
}));

export const SnackbarContext = React.createContext();

export function SnackbarProviderWrapper({ children }) {
  const classes = useStyles();
  const notistackRef = React.createRef();

  const snackbar = {
    success: (message) => {
      if (notistackRef.current) {
        notistackRef.current.enqueueSnackbar(message, { variant: 'success' });
      }
    },
    error: (message) => {
      if (notistackRef.current) {
        notistackRef.current.enqueueSnackbar(message, { variant: 'error' });
      }
    },
    warning: (message) => {
      if (notistackRef.current) {
        notistackRef.current.enqueueSnackbar(message, { variant: 'warning' });
      }
    },
    info: (message) => {
      if (notistackRef.current) {
        notistackRef.current.enqueueSnackbar(message, { variant: 'info' });
      }
    },
  };

  return (
    <SnackbarContext.Provider value={snackbar}>
      <SnackbarProvider
        ref={notistackRef}
        maxSnack={3}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        classes={{ containerRoot: classes.snackbar }}
      >
        {children}
      </SnackbarProvider>
    </SnackbarContext.Provider>
  );
}

export const useSnackbar = () => React.useContext(SnackbarContext); 