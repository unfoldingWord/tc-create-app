import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ParallelScripture } from 'scripture-resources-rcl';
import { useDeepCompareMemo } from 'use-deep-compare';
import { getMuiTheme } from './muiTheme';

export default function ScriptureHeader({
  quote,
  onQuote,
  occurrence: _occurrence,
  reference,
  buttons,
  open,
}) {
  const __occurrence = (_occurrence === '\\-1') ? -1 : _occurrence;
  const occurrence = Number(__occurrence);

  const component = useDeepCompareMemo(() => {
    return (
      <ParallelScripture
        open={open}
        reference={reference}
        quote={quote}
        onQuote={onQuote}
        occurrence={occurrence}
        height='250px'
        buttons={buttons}
      />
    );
  }, [quote, occurrence, reference, open, buttons, onQuote]);

  return (
    <MuiThemeProvider theme={getMuiTheme}>
      {component}
    </MuiThemeProvider>
  );
};
