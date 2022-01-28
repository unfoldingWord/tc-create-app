import React, { useState } from 'react';
import { Typography } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import {
  useDeepCompareCallback,
  useDeepCompareEffect,
  useDeepCompareMemo,
} from 'use-deep-compare';

import QuoteSelector from './QuoteSelector';

export default function RowHeader({
  rowData,
  actionsMenu,
  delimiters,
  open,
}) {
  const classes = useStyles();

  const defaultState = {
    quote: undefined,
    occurrence: undefined,
    reference: undefined,
  };
  const [state, setState] = useState(defaultState);

  useDeepCompareEffect(() => {
    const quote = rowData[5].split(delimiters.cell)[1];
    const occurrence = rowData[6].split(delimiters.cell)[1];
    const bookId = rowData[0].split(delimiters.cell)[1];
    const chapter = rowData[1].split(delimiters.cell)[1];
    const verse = rowData[2].split(delimiters.cell)[1];
    const _state = {
      quote,
      occurrence,
      bookId,
      chapter,
      verse,
    };
    setState(_state);
  }, [rowData]);

  const onQuote = useDeepCompareCallback((quote) => {
    setState({ ...state, quote });
  }, [state]);

  const scriptureHeader = useDeepCompareMemo(() => {
    let _component;

    const reference = {
      bookId: state.bookId?.toLowerCase(),
      chapter: parseInt(state.chapter),
      verse: parseInt(state.verse),
    };

    if (reference.chapter > 0 && reference.verse > 0) {
      _component = (
        <div className={classes.quoteHeader}>
          <QuoteSelector
            reference={reference}
            quote={state.quote}
            onQuote={onQuote}
            occurrence={state.occurrence}
            height='250px'
            buttons={actionsMenu}
            open={open}
          />
        </div>
      );
    };
    return _component;
  }, [state, actionsMenu]);

  const defaultHeader = useDeepCompareMemo(() => (
    <div className={classes.defaultHeader}>
      <Typography variant='h6' className={classes.title}>
        {`${state.bookId} ${state.chapter}:${state.verse}`}
      </Typography>
      {actionsMenu}
    </div>
  ), [classes, state]);

  return scriptureHeader || defaultHeader;
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
