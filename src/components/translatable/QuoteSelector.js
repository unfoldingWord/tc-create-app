import React, { useMemo } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ParallelScripture }
  from 'scripture-resources-rcl';
import { getMuiTheme } from './muiTheme';

function QuoteSelector({
  quote,
  onQuote,
  occurrence: _occurrence,
  reference,
  buttons,
}) {
  const __occurrence = (_occurrence === '\\-1') ? -1 : _occurrence;
  const occurrence = Number(__occurrence);
  const component = useMemo(() => (
    <ParallelScripture
      reference={reference}
      quote={quote}
      onQuote={onQuote}
      occurrence={occurrence}
      height='250px'
      buttons={buttons}
    />), [buttons, occurrence, onQuote, quote, reference]);
  return (
    <MuiThemeProvider theme={getMuiTheme}>
      {component}
    </MuiThemeProvider>
  );
};

export default React.memo(QuoteSelector);
