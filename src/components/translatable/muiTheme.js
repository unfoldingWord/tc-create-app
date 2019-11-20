import { createMuiTheme } from '@material-ui/core/styles';

export const getMuiTheme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        display: 'table-cell',
      },
    },
    MuiTableRow: {
      root: {
        display: 'table-row',
      }
    },
  }
});