import React, { useMemo } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
//import { ParallelScripture, withResources } from 'scripture-resources-rcl';
import {ParallelScripture, ResourcesContextProvider} 
  from "scripture-resources-rcl";
import { testament } from '../../core/bcv.js';
import { SERVER_URL } from '../../core/state.defaults';
import { getMuiTheme } from './muiTheme';

//const ParallelScriptureWithResources = withResources(ParallelScripture);

function QuoteSelector({
  quote,
  onQuote,
  occurrence: _occurrence,
  reference,
  buttons,
}) {
  const config = { server: SERVER_URL };
  const _testament = useMemo(() => testament(reference), [reference]);
  let hebrewLink = 'unfoldingWord/hbo/uhb/master';
  let greekLink = 'unfoldingWord/el-x-koine/ugnt/master';
  let originalLink = (_testament === 'old') ? hebrewLink : greekLink;

  // need to add reference bookId to resource links
  const _resourceLinks = [
    originalLink,
    'unfoldingWord/en/ult/master',
    'unfoldingWord/en/ust/master',
  ];
  const bookId = reference.bookId;
  const resourceLinks = _resourceLinks.map( (link) => {
    return link+'/'+bookId;
  });
  const occurrence = (_occurrence == "\\-1") ? -1 : _occurrence;

  // manage the state of the resources for the provider context
  const [ resources, setResources ] = React.useState([]);

  return (
    <MuiThemeProvider theme={getMuiTheme}>
      <ResourcesContextProvider
        resourceLinks={resourceLinks}
        resources={resources}
        onResources={setResources}
        config={config}
      >
        <ParallelScripture
          resources={resources}
          reference={reference}
          quote={quote}
          onQuote={onQuote}
          occurrence={occurrence}
          height='250px'
          buttons={buttons}
        />
      </ResourcesContextProvider>
    </MuiThemeProvider>
  );
};

export default QuoteSelector;

/*
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
*/