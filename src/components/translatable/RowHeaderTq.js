import React, {
  useState, useEffect,
} from 'react';
import isEqual from 'lodash.isequal';
import { makeStyles } from '@material-ui/core/styles';

import { Typography } from '@material-ui/core';
import QuoteSelector from './QuoteSelector';

function RowHeaderTq({
  bookId,
  rowData,
  actionsMenu,
  delimiters,
  open,
}) {
  const classes = useStyles();
  const _quote = rowData[3].split(delimiters.cell)[1];
  const [quote, setQuote] = useState(_quote);

  useEffect(() => {
    setQuote(_quote);
  }, [_quote]);

  const book = bookId;
  const chapter = rowData[0].split(delimiters.cell)[1].split(':')[0];
  const verse = rowData[0].split(delimiters.cell)[1].split(':')[1];
  const occurrence = rowData[4].split(delimiters.cell)[1];
  const reference = {
    bookId: book.toLowerCase(),
    chapter: parseInt(chapter),
    verse: parseInt(verse),
  };

  let _component = (
    <div className={classes.defaultHeader}>
      <Typography variant='h6' className={classes.title}>
        {`${bookId.toUpperCase()} ${reference}`}
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

export default React.memo(RowHeaderTq, propsAreEqual);
