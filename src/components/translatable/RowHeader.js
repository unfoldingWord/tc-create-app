import React, {useState, useCallback} from 'react';
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
  const _quote = rowData[5].split(delimiters.cell)[0];
  const [quote, setQuote] = useState(_quote);
  const [show, setShow] = useState(false);

  const book = rowData[0].split(delimiters.cell)[0];
  const chapter = rowData[1].split(delimiters.cell)[0];
  const verse = rowData[2].split(delimiters.cell)[0];

  const onEnter = useCallback(() => { setShow(true); }, []);
  
  const reference = {
    bookId: book.toLowerCase(),
    chapter: parseInt(chapter),
    verse: parseInt(verse)
  };
  let quoteComponent = <></>;
  if (show && reference.bookId && reference.chapter && reference.verse) {
    quoteComponent = (
      <QuoteSelector
        reference={reference}
        quote={quote}
        onQuote={setQuote}
        height='250px'
      />
    );
  }

  const component = (
    <Waypoint onEnter={onEnter}>
      <div style={{width: '100%'}}>
        <div style={{width: '100%', display: 'flex', alignContent: 'center', justifyContent: 'space-between'}}>
          <Typography variant='h6' style={style}>
            {`${book} ${chapter}:${verse}`}
          </Typography>
          {actionsMenu}
        </div>
        <div style={{width: '100%'}}>
          {quoteComponent}
        </div>
      </div>
    </Waypoint>
  );
  return component;
};

const style = {
  lineHeight: '1.0',
  fontWeight: 'bold',
  paddingTop: '11px',
};

export default RowHeader;
