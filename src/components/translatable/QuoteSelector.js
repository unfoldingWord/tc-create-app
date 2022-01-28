import React, { useState } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ParallelScripture } from 'scripture-resources-rcl';
import { useDeepCompareMemo } from 'use-deep-compare';
import { Skeleton } from '@material-ui/lab';
import { Waypoint } from 'react-waypoint';
import { getMuiTheme } from './muiTheme';

function QuoteSelector({
  quote,
  onQuote,
  occurrence: _occurrence,
  reference,
  buttons,
  open,
}) {
  const [viewed, setViewed] = useState();
  const __occurrence = (_occurrence === '\\-1') ? -1 : _occurrence;
  const occurrence = Number(__occurrence);

  const onVisibility = (isVisible) => {
    if (isVisible) {
      setViewed(true);
    };
  };

  const component = useDeepCompareMemo(() => {
    const skeleton = (
      <>
        <Waypoint onEnter={onVisibility} />
        <Skeleton height={150} width='100%' />
      </>
    );

    return !viewed ? skeleton : (
      <ParallelScripture
        open={open}
        reference={reference}
        quote={quote}
        onQuote={onQuote}
        occurrence={occurrence}
        height='250px'
        buttons={buttons}
      />
    )
  }, [viewed, quote, occurrence, reference, open, buttons, onQuote]);

  return (
    <MuiThemeProvider theme={getMuiTheme}>
      {component}
    </MuiThemeProvider>
  );
};

export default React.memo(QuoteSelector);
