import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import {ParallelScripture, withResources} from 'scripture-resources-rcl';

import { getMuiTheme } from './muiTheme';

const ParallelScriptureWithResources = withResources(ParallelScripture);

function QuoteSelector({
  quote,
  onQuote,
  reference,
}) {  
  const config = {server: 'https://git.door43.org'};
  const resourceLinks = [
    'unfoldingWord/el-x-koine/ugnt/master',
    'unfoldingWord/en/ult/master',
    'unfoldingWord/en/ust/master',
  ];

  return (
    <MuiThemeProvider theme={getMuiTheme}>
      <ParallelScriptureWithResources
        resourceLinks={resourceLinks}
        config={config}
        reference={reference}
        quote={quote}
        onQuote={onQuote}
        height='250px'
      />
    </MuiThemeProvider>
  );
};

export default QuoteSelector;
