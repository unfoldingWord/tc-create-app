import React, {useMemo} from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import {ParallelScripture, withResources} from 'scripture-resources-rcl';
import {testament} from '../../core/bcv.js';

import { getMuiTheme } from './muiTheme';

const ParallelScriptureWithResources = withResources(ParallelScripture);

function QuoteSelector({
  quote,
  onQuote,
  occurrence: _occurrence,
  reference,
  buttons,
}) {  
  const config = {server: 'https://git.door43.org'};
  const _testament = useMemo(() => testament(reference), [reference]);
  let hebrewLink = 'unfoldingWord/hbo/uhb/master';
  let greekLink = 'unfoldingWord/el-x-koine/ugnt/master';
  let originalLink = (_testament === 'old') ? hebrewLink : greekLink;

  const resourceLinks = [
    originalLink,
    'unfoldingWord/en/ult/master',
    'unfoldingWord/en/ust/master',
  ];
  const occurrence = (_occurrence == "\\-1") ? -1 : _occurrence;

  return (
    <MuiThemeProvider theme={getMuiTheme}>
      <ParallelScriptureWithResources
        resourceLinks={resourceLinks}
        config={config}
        reference={reference}
        quote={quote}
        onQuote={onQuote}
        occurrence={occurrence}
        height='250px'
        buttons={buttons}
      />
    </MuiThemeProvider>
  );
};

export default QuoteSelector;
