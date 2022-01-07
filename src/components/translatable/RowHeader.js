import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import isEqual from 'lodash.isequal';

import { makeStyles } from '@material-ui/core/styles';
import {
  useDeepCompareCallback,
  useDeepCompareEffect,
  useDeepCompareMemo,
} from 'use-deep-compare';

import QuoteSelector from './QuoteSelector';

function RowHeader({
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
    const book = rowData[0].split(delimiters.cell)[1];
    const chapter = rowData[1].split(delimiters.cell)[1];
    const verse = rowData[2].split(delimiters.cell)[1];
    const reference = {
      bookId: book.toLowerCase(),
      chapter: parseInt(chapter),
      verse: parseInt(verse),
    };
    const _state = { quote, occurrence, reference };
    setState(_state);
  }, [rowData]);

  const onQuote = useDeepCompareCallback((quote) => {
    setState({ ...state, quote });
  }, [state]);

  const scriptureHeader = useDeepCompareMemo(() => {
    let _component;

    if (state.reference?.bookId && state.reference?.chapter && state.reference?.verse) {
      _component = (
        <div className={classes.quoteHeader}>
          <QuoteSelector
            reference={state.reference}
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
        {`${state.reference?.book} ${state.reference?.chapter}:${state.reference?.verse}`}
      </Typography>
      {actionsMenu}
    </div>
  ), [classes, state.reference]);

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

const propsAreEqual = (prevProps, nextProps) => (
  isEqual(prevProps.rowData, nextProps.rowData) &&
  isEqual(prevProps.delimiters, nextProps.delimiters) &&
  isEqual(prevProps.open, nextProps.open)
);

export default React.memo(RowHeader, propsAreEqual);
