import React, { useState, useCallback, useContext } from 'react';

import { DataTable } from 'datatable-translatable';
import { ResourcesContextProvider } from 'scripture-resources-rcl';

import { FileContext } from 'gitea-react-toolkit';

import {
  stripDefaultsFromResourceLinks,
  generateAllResourceLinks,
} from '../../core/resourceLinks';
import { SERVER_URL } from '../../core/state.defaults';
import { TargetFileContext } from '../../core/TargetFile.context';

import { AppContext } from '../../App.context';
import RowHeader from './RowHeader';

function TranslatableTSV() {
  // manage the state of the resources for the provider context
  const [resources, setResources] = useState([]);

  const {
    state: { resourceLinks },
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
  const allResourceLinksWithBookId = generateAllResourceLinks({
    bookId,
    resourceLinks,
  });

  const delimiters = { row: '\n', cell: '\t' };
  const rowHeader = (rowData, actionsMenu) => (
    <RowHeader
      rowData={rowData}
      actionsMenu={actionsMenu}
      delimiters={delimiters}
    />
  );
  const config = {
    compositeKeyIndices: [0, 1, 2, 3],
    columnsFilter: ['Chapter', 'SupportReference'],
    columnsShowDefault: [
      'SupportReference',
      'OrigQuote',
      'Occurrence',
      'OccurrenceNote',
    ],
    rowHeader,
  };
  let translatableProps = {
    sourceFile: sourceFile.content,
    targetFile: targetFile.content,
    onSave: targetFileActions.save,
    delimiters,
    config,
  };

  const serverConfig = {
    server: SERVER_URL,
    cache: {
      maxAge: 1 * 1 * 1 * 60 * 1000, // override cache to 1 minute
    },
  };

  return (
    <ResourcesContextProvider
      resourceLinks={allResourceLinksWithBookId}
      onResourceLinks={onResourceLinks}
      resources={resources}
      onResources={setResources}
      config={serverConfig}
    >
      <DataTable {...translatableProps} />
    </ResourcesContextProvider>
  );
}

export default TranslatableTSV;
