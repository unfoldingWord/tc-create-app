import { createTheme } from '@material-ui/core/styles';

export const getMuiTheme = createTheme({
  overrides: {
    MuiTableCell: { root: { display: 'table-cell' } },
    MuiTableRow: { root: { display: 'table-row' } },
  },
});