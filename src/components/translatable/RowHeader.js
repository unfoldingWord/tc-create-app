import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import { Waypoint } from 'react-waypoint';
import { Skeleton } from '@material-ui/lab';

import { useDeepCompareMemo } from 'use-deep-compare';

import ScriptureHeader from './ScriptureHeader';
import { columnIndexOfColumnNameFromColumnNames } from './helpers';

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
    fontWeight: 'bold',
    paddingTop: '11px',
  },
};

export default function RowHeader({
  rowData,
  actionsMenu,
  delimiters,
  columnNames,
  bookId,
  open,
}) {
  const [viewed, setViewed] = useState(false);

  const onVisibility = (isVisible) => {
    setViewed(isVisible);
  };

  const onLeave = () => {
    setViewed(false);
  };

  const {
    quote,
    occurrence,
    chapter,
    verse,
  } = useDeepCompareMemo(() => {
    let chapter, verse, quote, occurrence;

    let columnNamesToUse = [];
    if (columnNames.includes('OrigWords')) {
      columnNamesToUse = ['Reference', 'Chapter', 'Verse', 'OrigWords', 'Occurrence'];
    } else {
      columnNamesToUse = ['Reference', 'Chapter', 'Verse', 'OrigQuote', 'Occurrence'];
    }

    const indices = columnNamesToUse.map(columnName => {
      const index = columnIndexOfColumnNameFromColumnNames({ columnNames, columnName });
      return index;
    });
    const [referenceIndex, chapterIndex, verseIndex, quoteIndex, occurrenceIndex] = indices;

    if (referenceIndex > -1) {
      // find columIndex of Reference
      chapter = rowData[referenceIndex].split(delimiters.cell)[1].split(':')[0];
      verse = rowData[referenceIndex].split(delimiters.cell)[1].split(':')[1];
    } else if (chapterIndex && verseIndex) {
      // find columnIndex columnName "Chapter"
      chapter = rowData[chapterIndex].split(delimiters.cell)[1];
      // find columnIndex columnName "Verse"
      verse = rowData[verseIndex].split(delimiters.cell)[1];
    };

    if (quoteIndex > -1) {
      quote = rowData[quoteIndex].split(delimiters.cell)[1];
    };

    if (occurrenceIndex > -1) {
      occurrence = rowData[occurrenceIndex].split(delimiters.cell)[1];
    };

    return {
      chapter,
      verse,
      quote,
      occurrence,
    };
  }, [rowData]);

  const scriptureHeader = useDeepCompareMemo(() => {
    let _component;

    const reference = {
      bookId: bookId?.toLowerCase(),
      chapter: parseInt(chapter),
      verse: parseInt(verse),
    };

    if (viewed && reference.chapter > 0 && reference.verse > 0) {
      _component = (
        <div style={styles.quoteHeader}>
          <ScriptureHeader
            reference={reference}
            quote={quote}
            occurrence={occurrence}
            height='250px'
            buttons={actionsMenu}
            open={open}
          />
          <Waypoint onLeave={onLeave} />
        </div>
      );
    };
    return _component;
  }, [viewed, bookId, chapter, verse, quote, occurrence, actionsMenu, styles, open]);

  const defaultHeader = useDeepCompareMemo(() => (
    <>
      {/* {console.log(chapter, verse)} */}
      <div style={styles.defaultHeader}>
        <Typography variant='h6' style={styles.title}>
          {chapter && verse !== undefined ? `${bookId.toUpperCase()} ${chapter}:${verse}` : `${bookId.toUpperCase()} ${chapter}`}
        </Typography>
        <Waypoint onLeave={onLeave} />
        {actionsMenu}
      </div>
    </>
  ), [styles, bookId, chapter, verse]);

  const skeleton = (
    <>
      <Skeleton height={150} width='100%' />
      <Waypoint onEnter={onVisibility} onLeave={onLeave} />
    </>
  );

  let component = skeleton;

  if (viewed) {
    const isOBS = bookId.toLowerCase() === "obs";

    if (isOBS) {
      component = defaultHeader
    } else {
      component = scriptureHeader || defaultHeader;
    };
  };

  return component;
};
