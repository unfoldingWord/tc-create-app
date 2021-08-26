import React from 'react';
import isEqual from 'lodash.isequal';
import { makeStyles } from '@material-ui/core/styles';

import { Typography } from '@material-ui/core';

function RowHeaderSq({
  bookId,
  rowData,
  actionsMenu,
  delimiters,
}) {
  const classes = useStyles();
  const reference = rowData[0].split(delimiters.cell)[0]
  let _component = (
    <div className={classes.defaultHeader}>
      <Typography variant='h6' className={classes.title}>
        {`${bookId.toUpperCase()} ${reference}`}
      </Typography>
      {actionsMenu}
    </div>
  );
  return _component;
};

const useStyles = makeStyles(theme => ({
  defaultHeader: {
    width: '100%',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  quoteHeader: { width: '100%' },
  title: {
    lineHeight: '1.0',
    fontWeight: 'bold',
    paddingTop: '11px',
  },
}));

const propsAreEqual = (prevProps, nextProps) => (
  isEqual(prevProps.rowData, nextProps.rowData) &&
  isEqual(prevProps.delimiters, nextProps.delimiters) &&
  isEqual(prevProps.open, nextProps.open)
);

export default React.memo(RowHeaderSq, propsAreEqual);
