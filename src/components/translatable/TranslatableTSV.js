import React, {
  useState, useCallback, useContext, useMemo,
} from 'react';

import { DataTable } from 'datatable-translatable';
import { ResourcesContextProvider, ResourcesContext } from 'scripture-resources-rcl';

import { FileContext } from 'gitea-react-toolkit';

import { CircularProgress } from '@material-ui/core';
import {
  defaultResourceLinks,
  stripDefaultsFromResourceLinks,
  generateAllResourceLinks,
} from '../../core/resourceLinks';
import { SERVER_URL } from '../../core/state.defaults';
import { TargetFileContext } from '../../core/TargetFile.context';

import { AppContext } from '../../App.context';
import RowHeader from './RowHeader';
const delimiters = { row: '\n', cell: '\t' };
const config = {
  compositeKeyIndices: [0, 1, 2, 3],
  columnsFilter: ['Chapter', 'SupportReference'],
  columnsShowDefault: [
    'SupportReference',
    'OccurrenceNote',
  ],
};

function TranslatableTSVWrapper() {
  // manage the state of the resources for the provider context
  const [resources, setResources] = useState([]);

  const {
    state: { resourceLinks, expandedScripture },
    actions: { setResourceLinks },
  } = useContext(AppContext);

  const { state: sourceFile } = useContext(FileContext);
  const { state: targetFile, actions: targetFileActions } = useContext(
    TargetFileContext
  );

  const bookId = sourceFile.filepath.split(/\d+-|\./)[1].toLowerCase();

  const onResourceLinks = useCallback(
    (_resourceLinks) => {
      // Remove bookId and remove defaults:
      const persistedResourceLinks = stripDefaultsFromResourceLinks({
        resourceLinks: _resourceLinks,
        bookId,
      });
      // Persist to App context:
      setResourceLinks(persistedResourceLinks);
    },
    [bookId, setResourceLinks]
  );

  // Build bookId and add defaults:
  const defaultResourceLinksWithBookId = generateAllResourceLinks({
    bookId,
    defaultResourceLinks,
  });
  const allResourceLinksWithBookId = generateAllResourceLinks({
    bookId,
    resourceLinks,
  });
  const rowHeader = useCallback((rowData, actionsMenu) => (
    <RowHeader
      open={expandedScripture}
      rowData={rowData}
      actionsMenu={actionsMenu}
      delimiters={delimiters}
    />
  ), [expandedScripture]);


  const generateRowId = useCallback((rowData) => {
    const [chapter] = rowData[2].split(delimiters.cell);
    const [verse] = rowData[3].split(delimiters.cell);
    const [uid] = rowData[4].split(delimiters.cell);
    return `header-${chapter}-${verse}-${uid}`;
  }, []);

  const serverConfig = {
    server: SERVER_URL,
    cache: { maxAge: 1 * 1 * 1 * 60 * 1000, // override cache to 1 minute
    },
  };


  const datatable = useMemo(() => {
    config.rowHeader = rowHeader;
    return (
      <DataTable
        sourceFile={sourceFile.content}
        targetFile={targetFile.content}
        onSave={targetFileActions.save}
        delimiters={delimiters}
        config={config}
        generateRowId={generateRowId}
      />
    );
  }, [rowHeader, sourceFile.content, targetFile.content, targetFileActions.save, generateRowId]);

  return (
    <ResourcesContextProvider
      defaultResourceLinks={defaultResourceLinksWithBookId}
      resourceLinks={allResourceLinksWithBookId}
      onResourceLinks={onResourceLinks}
      resources={resources}
      onResources={setResources}
      config={serverConfig}
    >
      <TranslatableTSV datatable={datatable} />
    </ResourcesContextProvider>
  );
}

function TranslatableTSV({ datatable }) {
  const { state:{ books } } = useContext(ResourcesContext);
  return books ? datatable :
    (<div style={{
      width: '100%', display:'flex', justifyContent: 'center',
    }}
    ><CircularProgress /></div>);
}

export default TranslatableTSVWrapper;
