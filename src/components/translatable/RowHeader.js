import React, {useState, useCallback, useEffect} from 'react';
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
  const _quote = rowData[5].split(delimiters.cell)[1];
  const [quote, setQuote] = useState(_quote);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setQuote(_quote);
  },[_quote]);

  const book = rowData[0].split(delimiters.cell)[0];
  const chapter = rowData[1].split(delimiters.cell)[0];
  const verse = rowData[2].split(delimiters.cell)[0];

  const onEnter = useCallback(() => { setShow(true); }, []);
  
  const reference = {
    bookId: book.toLowerCase(),
    chapter: parseInt(chapter),
    verse: parseInt(verse)
  };

  let component = (
    <Waypoint onEnter={onEnter}>
      <div className={classes.defaultHeader}>
        <Typography variant='h6' className={classes.title}>
          {`${book} ${chapter}:${verse}`}
        </Typography>
        {actionsMenu}
      </div>
    </Waypoint>
  );

  if (show && reference.bookId && reference.chapter && reference.verse) {
    component = (
      <div className={classes.quoteHeader}>
        <QuoteSelector
          reference={reference}
          quote={quote}
          // onQuote={setQuote}
          height='250px'
          buttons={actionsMenu}
        />
      </div>
    );
  }

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
