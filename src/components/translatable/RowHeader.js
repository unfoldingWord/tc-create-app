import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Waypoint} from 'react-waypoint';

import {
  Typography,
} from '@material-ui/core';

import QuoteSelector from './QuoteSelector';

function RowHeader({
  rowData,
  actionsMenu,
  delimiters,
}) {
  const classes = useStyles();
  const _quote = useMemo (() => rowData[5].split(delimiters.cell)[1], [rowData, delimiters.cell]);
  const [quote, setQuote] = useState(_quote);
  const [showReference, setShowReference] = useState();

  useEffect(() => {
    setQuote(_quote);
  },[_quote]);

  
  const book = rowData[0].split(delimiters.cell)[1];
  const chapter = rowData[1].split(delimiters.cell)[1];
  const verse = rowData[2].split(delimiters.cell)[1];
  const occurrence = rowData[6].split(delimiters.cell)[1];

  const reference = {
    bookId: book.toLowerCase(),
    chapter: parseInt(chapter),
    verse: parseInt(verse)
  };

  const onEnter = useCallback(() => { setShowReference(reference); }, [reference]);
  useEffect(() => {
    if (showReference && reference.bookId !== showReference.bookId) setShowReference();
  }, [showReference, reference.bookId]);

  const defaultHeader = (
    <div className={classes.defaultHeader}>
      <Typography variant='h6' className={classes.title}>
        {`${book} ${chapter}:${verse}`}
      </Typography>
      {actionsMenu}
    </div>
  );

  const component = useMemo(() => {
    let _component = defaultHeader;
    if (reference.bookId && reference.chapter && reference.verse) {
      if (showReference && showReference.bookId === reference.bookId) {
        _component = (
          <div className={classes.quoteHeader}>
            <QuoteSelector
              reference={reference}
              quote={quote}
              onQuote={setQuote}
              occurrence={occurrence}
              height='250px'
              buttons={actionsMenu}
            />
          </div>
        );
      } else {
        _component = (
          <Waypoint onEnter={onEnter}>
            {defaultHeader}
          </Waypoint>
        );
      }
    }
    return _component;
  }, [classes, reference, quote, occurrence, actionsMenu, showReference, defaultHeader, onEnter]);

  return component;
};

const useStyles = makeStyles(theme => ({
  defaultHeader: {
    width: '100%',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  quoteHeader: {
    width: '100%'
  },
  title: {
    lineHeight: '1.0',
    fontWeight: 'bold',
    paddingTop: '11px',
  },
}));

export default RowHeader;
