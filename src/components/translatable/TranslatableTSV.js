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
const _config = {
  compositeKeyIndices: [0, 1, 2, 3],
  columnsFilter: ['Chapter', 'SupportReference'],
  columnsShowDefault: [
    'SupportReference',
    'OccurrenceNote',
  ],
};

function TranslatableTSVWrapper({ onSave }) {
  // manage the state of the resources for the provider context
  const [resources, setResources] = useState([]);

  const {
    state: { resourceLinks, expandedScripture },
    actions: { setResourceLinks },
  } = useContext(AppContext);

  const { state: sourceFile } = useContext(FileContext);
  const { state: targetFile } = useContext(
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

  const options = {
    page: 0,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50, 100],
  };

  const rowHeader = useCallback((rowData, actionsMenu) => (<RowHeader
    open={expandedScripture}
    rowData={rowData}
    actionsMenu={actionsMenu}
    delimiters={delimiters}
  />), [expandedScripture]);


  const datatable = useMemo(() => {
    _config.rowHeader = rowHeader;
    return (
      <DataTable
        sourceFile={sourceFile.content}
        targetFile={targetFile.content}
        onSave={onSave}
        delimiters={delimiters}
        config={_config}
        generateRowId={generateRowId}
        options={options}
      />
    );
  }, [sourceFile.content, targetFile.content, onSave, generateRowId, options, rowHeader]);
  return (
    <ResourcesContextProvider
      reference={{ bookId }}
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
  const { state: { books } } = useContext(ResourcesContext);
  return books ? datatable :
    (<div style={{
      width: '100%', display: 'flex', justifyContent: 'center',
    }}
    ><CircularProgress /></div>);
}

export default TranslatableTSVWrapper;
