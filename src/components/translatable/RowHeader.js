import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import { Waypoint } from 'react-waypoint';
import { Skeleton } from '@material-ui/lab';

import {
  useDeepCompareCallback,
  useDeepCompareEffect,
  useDeepCompareMemo,
} from 'use-deep-compare';

import QuoteSelector from './QuoteSelector';

const styles = {
  defaultHeader: {
    width: '100%',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  quoteHeader: { width: '100%' },
  title: {
    lineHeight: '1.0',
    paddingTop: '11px',
  },
};

export default function RowHeader({
  rowData,
  actionsMenu,
  delimiters,
  open,
}) {
  const [viewed, setViewed] = useState(false);

  const onVisibility = (isVisible) => {
    setViewed(isVisible);
  };

  const onLeave = () => {
    setViewed(false);
  };

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

    if (viewed && reference.chapter > 0 && reference.verse > 0) {
      _component = (
        <div style={styles.quoteHeader}>
          <QuoteSelector
            reference={reference}
            quote={state.quote}
            onQuote={onQuote}
            occurrence={state.occurrence}
            height='250px'
            buttons={actionsMenu}
            open={open}
          />
          <Waypoint onLeave={onLeave} />
        </div>
      );
    };
    return _component;
  }, [viewed, state, actionsMenu, styles]);

  const defaultHeader = useDeepCompareMemo(() => (
    <div style={styles.defaultHeader}>
      <Typography variant='h6' style={styles.title}>
        {`${state.bookId} ${state.chapter}:${state.verse}`}
      </Typography>
      <Waypoint onLeave={onLeave} />
      {actionsMenu}
    </div>
  ), [styles, state]);

  const skeleton = (
    <>
      <Skeleton height={150} width='100%' />
      <Waypoint onEnter={onVisibility} onLeave={onLeave} />
    </>
  );

  const component = viewed ? (scriptureHeader || defaultHeader) : skeleton;

  return component;
};
