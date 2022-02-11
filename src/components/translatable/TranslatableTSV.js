import React, {
  useState,
  useCallback,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { useDeepCompareCallback, useDeepCompareMemo } from 'use-deep-compare';

import { CircularProgress } from '@material-ui/core';

import { DataTable } from 'datatable-translatable';
import { ResourcesContextProvider, ResourcesContext } from 'scripture-resources-rcl';
import {
  defaultResourceLinks,
  stripDefaultsFromResourceLinks,
  generateAllResourceLinks,
} from '../../core/resourceLinks';
import { SERVER_URL } from '../../core/state.defaults';

import { AppContext } from '../../App.context';
import useValidation from '../../hooks/useValidation';
import RowHeader from './RowHeader';

const delimiters = { row: '\n', cell: '\t' };
const _config = {
  compositeKeyIndices: [0, 1, 2, 3], // 0 is bookId, 1 is chapter, 2 is verse, 3 is id
  columnsFilter: ['Chapter', 'Verse', 'SupportReference'],
  columnsShowDefault: [
    'SupportReference',
    'OccurrenceNote',
  ],
};

// WIP: multiple tsv types
// const sevenColumnConfig = {
//   ..._config,
//   compositeKeyIndices: [0, 1], // 0 is reference 'GEN 1:1', 1 is id
//   columnsFilter: ['Reference', 'SupportReference'],
// };

// const nineColumnConfig = {
//   ..._config,
//   compositeKeyIndices: [0, 1, 2, 3], // 0 is bookId, 1 is chapter, 2 is verse, 3 is id
//   columnsFilter: ['Chapter', 'Verse', 'SupportReference'],
// };

const serverConfig = {
  server: SERVER_URL,
  cache: { maxAge: 1 * 1 * 1 * 60 * 1000 }, // override cache to 1 minute
};

function TranslatableTSVWrapper({
  onSave,
  onEdit,
  onContentIsDirty,
}) {
  // manage the state of the resources for the provider context
  const [resources, setResources] = useState([]);

  const {
    state: {
      resourceLinks,
      expandedScripture,
    },
    actions: { setResourceLinks },
    giteaReactToolkit: {
      sourceFileHook,
      targetFileHook,
    },
  } = useContext(AppContext);

  const {
    filepath: sourceFilepath,
    content: sourceContent,
  } = sourceFileHook.state || {};
  const { content: targetContent } = targetFileHook.state || {};

  const {
    actions: { onValidate },
    component: validationComponent,
  } = useValidation( { delimiters } );

  const bookId = sourceFilepath.split(/\d+-|\./)[1].toLowerCase();

  const onResourceLinks = useCallback((_resourceLinks) => {
    // Remove bookId and remove defaults:
    const persistedResourceLinks = stripDefaultsFromResourceLinks({
      resourceLinks: _resourceLinks,
      bookId,
    });
    // Persist to App context:
    setResourceLinks(persistedResourceLinks);
  }, [bookId, setResourceLinks]);

  // Build bookId and add defaults:
  const defaultResourceLinksWithBookId = generateAllResourceLinks({ bookId, defaultResourceLinks });
  const allResourceLinksWithBookId = generateAllResourceLinks({ bookId, resourceLinks });

  const generateRowId = useCallback((rowData) => {
    const [chapter] = rowData[2].split(delimiters.cell);
    const [verse] = rowData[3].split(delimiters.cell);
    const [uid] = rowData[4].split(delimiters.cell);
    return `header-${chapter}-${verse}-${uid}`;
  }, []);

  const options = {
    page: 0,
    rowsPerPage: 25,
    rowsPerPageOptions: [10, 25, 50, 100],
  };

  const rowHeader = useDeepCompareCallback((rowData, actionsMenu) => (
    <RowHeader
      open={expandedScripture}
      rowData={rowData}
      actionsMenu={actionsMenu}
      delimiters={delimiters}
    />
  ), [expandedScripture, delimiters]);

  const datatable = useDeepCompareMemo(() => {
    _config.rowHeader = rowHeader;
    return (
      <DataTable
        sourceFile={sourceContent}
        targetFile={targetContent}
        onSave={onSave}
        onEdit={onEdit}
        onValidate={onValidate}
        onContentIsDirty={onContentIsDirty}
        delimiters={delimiters}
        config={_config}
        generateRowId={generateRowId}
        options={options}
      />
    );
  }, [sourceContent, targetContent, onSave, onEdit, onValidate, onContentIsDirty, generateRowId, options, rowHeader]);

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
      { validationComponent }
    </ResourcesContextProvider>
  );
}

function TranslatableTSV({ datatable }) {
  const { state: { books } } = useContext(ResourcesContext);
  return books ? datatable : (
    <div style={{
      width: '100%', display: 'flex', justifyContent: 'center',
    }}
    >
      <CircularProgress />
    </div>
  );
};

TranslatableTSV.propTypes = {
  /** datatable to render */
  datatable: PropTypes.element.isRequired,
};

TranslatableTSVWrapper.propTypes = {
  /** function triggered for save */
  onSave: PropTypes.func.isRequired,
  /** function triggered on edit */
  onEdit: PropTypes.func.isRequired,
  /** function triggered if content is dirty */
  onContentIsDirty: PropTypes.func.isRequired,
};

export default TranslatableTSVWrapper;