import React from 'react';
import {
  Typography,
} from '@material-ui/core';

function RowHeader({
  rowData,
  actionsMenu,
  delimiters
}) {
  const book = rowData[0].split(delimiters.cell).find((value) => value);
  const chapter = rowData[1].split(delimiters.cell).find((value) => value);
  const verse = rowData[2].split(delimiters.cell).find((value) => value);

  const component = (
    <>
      <Typography variant='h6' style={style}>
        {`${book} ${chapter}:${verse}`}
      </Typography>
      {actionsMenu}
    </>
  );
  return component;
};

const style = {
  lineHeight: '1.0',
  fontWeight: 'bold',
};

export default RowHeader;