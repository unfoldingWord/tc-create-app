import React, {
  useState, useEffect,
} from 'react';
import isEqual from 'lodash.isequal';
import { makeStyles } from '@material-ui/core/styles';

import { Typography } from '@material-ui/core';
import QuoteSelector from './QuoteSelector';

function RowHeader({
  rowData,
  actionsMenu,
  delimiters,
  open,
}) {
  const classes = useStyles();
  const _quote = rowData[5].split(delimiters.cell)[1];
  const [quote, setQuote] = useState(_quote);

  useEffect(() => {
    setQuote(_quote);
  }, [_quote]);

  const book = rowData[0].split(delimiters.cell)[1];
  const chapter = rowData[1].split(delimiters.cell)[1];
  const verse = rowData[2].split(delimiters.cell)[1];
  const occurrence = rowData[6].split(delimiters.cell)[1];
  const reference = {
    bookId: book.toLowerCase(),
    chapter: parseInt(chapter),
    verse: parseInt(verse),
  };

  let _component = (
    <div className={classes.defaultHeader}>
      <Typography variant='h6' className={classes.title}>
        {`${book} ${chapter}:${verse}`}
      </Typography>
      {actionsMenu}
    </div>);

  if (reference && reference.bookId && reference.chapter && reference.verse) {
    _component = (
      <div className={classes.quoteHeader}>
        <QuoteSelector
          reference={reference}
          quote={quote}
          onQuote={setQuote}
          occurrence={occurrence}
          height='250px'
          buttons={actionsMenu}
          open={open}
        />
      </div>
    );
  }
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

export default React.memo(RowHeader, propsAreEqual);
