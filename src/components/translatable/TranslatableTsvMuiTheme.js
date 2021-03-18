import { createMuiTheme } from '@material-ui/core/styles';

export const getTranslatableTsvMuiTheme = createMuiTheme({
  overrides: {
    MuiToolbar: {
      root: {
        top: 0
      },
    },
  }
});