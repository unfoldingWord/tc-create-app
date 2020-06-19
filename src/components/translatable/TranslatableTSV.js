import React, { useState, useContext, useEffect } from 'react';

import { DataTable } from 'datatable-translatable';
import { ResourcesContextProvider } from 'scripture-resources-rcl';

import { FileContext } from 'gitea-react-toolkit';

import { TargetFileContext } from '../../core/TargetFile.context';
import { testament } from '../../core/bcv.js';
import { SERVER_URL } from '../../core/state.defaults';

import { AppContext } from '../../App.context';
import RowHeader from './RowHeader';

function TranslatableTSV() {
  // manage the state of the resources for the provider context
  const [resources, setResources] = useState([]);
  const [resourceLinks, setResourceLinks] = useState([]);

  const {
    state: { resourceLinks: userResourceLinks },
    actions: { setResourceLinks: setUserResourceLinks },
  } = useContext(AppContext);

  const { state: sourceFile } = useContext(FileContext);
  const { state: targetFile, actions: targetFileActions } = useContext(
    TargetFileContext
  );

  // Appends book ID to the general resourcePath accepted by the UI.
  const addResourceLink = (newResourceLink) => {
    // Persist the ORIGINAL path without the bookId.
    const _userResourceLinks = [...userResourceLinks, newResourceLink];
    setUserResourceLinks(_userResourceLinks);

    // Transform, appending bookId.
    return newResourceLink + bookId;
  };

  const bookId = sourceFile.filepath.split(/\d+-|\./)[1].toLowerCase();

  useEffect(() => {
    const reference = { bookId };
    const _testament = testament(reference);
    let hebrewLink = 'unfoldingWord/hbo/uhb/master';
    let greekLink = 'unfoldingWord/el-x-koine/ugnt/master';
    let originalLink = _testament === 'old' ? hebrewLink : greekLink;

    // need to add reference bookId to resource links
    const _resourceLinks = [
      originalLink,
      'unfoldingWord/en/ult/master',
      'unfoldingWord/en/ust/master',
      ...userResourceLinks,
    ];

    // Add bookId to all resource paths:
    const resourceLinksWithBookId = _resourceLinks.map((link) => {
      return link + '/' + bookId;
    });
    setResourceLinks(resourceLinksWithBookId);
  }, [bookId, userResourceLinks, setResourceLinks]);

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
      resourceLinks={resourceLinks}
      onResourceLinks={setResourceLinks}
      onAddResourceLink={addResourceLink}
      resources={resources}
      onResources={setResources}
      config={serverConfig}
    >
      <DataTable {...translatableProps} />
    </ResourcesContextProvider>
  );
}

export default TranslatableTSV;
