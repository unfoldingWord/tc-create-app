import React, {
  useState,
  useCallback,
  useContext,
  useMemo,
  useEffect
} from 'react';
import PropTypes from 'prop-types';
import { useDeepCompareCallback, useDeepCompareMemo } from 'use-deep-compare';

import { DataTable } from 'datatable-translatable';
import { ResourcesContextProvider } from 'scripture-resources-rcl';
import * as parser from 'uw-tsv-parser';

import {
  defaultResourceLinks,
  stripDefaultsFromResourceLinks,
  generateAllResourceLinks,
} from '../../core/resourceLinks';
import { SERVER_URL } from '../../core/state.defaults';

import { AppContext } from '../../App.context';
import useValidation from '../../hooks/useValidation';
import RowHeader from './RowHeader';
import { usePermalinks } from '@gwdevs/permalinks-hooks';

import {
  columnNamesFromContent,
  columnsFilterFromColumnNames,
  columnsShowDefaultFromColumnNames,
  compositeKeyIndicesFromColumnNames,
  generateRowId,
} from './helpers';

const delimiters = { row: '\n', cell: '\t' };

// override cache to 1 minute for scripture resources
const serverConfig = {
  server: SERVER_URL,
  cache: { maxAge: 1 * 1 * 1 * 60 * 1000 },
};

export default function TranslatableTSV({
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
      cachedFile,
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
  const { content: cachedContent } = cachedFile || {};

  const columnNames = useMemo(() => {
    const _columnNames = columnNamesFromContent({ content: sourceContent, delimiters });
    return _columnNames;
  }, [sourceContent]);

  const {
    actions: { onValidate },
    component: validationComponent,
  } = useValidation({ columnCount: columnNames.length, delimiters });

  const bookId = sourceFilepath?.split(/.*[-_]/)[1].split('.')[0].toLowerCase();

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

  const _generateRowId = useDeepCompareCallback((rowData) => {
    const rowId = generateRowId({
      rowData,
      columnNames,
      delimiters,
    });
    return rowId;
  }, [columnNames, delimiters]);

  const [options, setOptions] = useState({
    page: 0,
    rowsPerPage: 25,
    rowsPerPageOptions: [10, 25, 50, 100],
  });

  const { query } = usePermalinks({});

  console.log({columnNames,targetContent,cachedContent});

  useEffect(() => {
    const exludedFromSearch = ['columns', 'check'];

    if (!query) return;

    //Sets searchText to first searchable param in query string.
    Object.keys(query).forEach((key) => {
      if (!exludedFromSearch.includes(key) && !options?.searchText) {
        console.log('CHANGING OPTIONS');
        setOptions((options) => ({ ...options, searchText: query[key] }));
      }
    });

  },[query,options.searchText]);

  const [extraColumns, setExtraColumns] = useState([]);

  useEffect(() => {
    if (query && columnNames && !extraColumns.length) {
      const queryColumns = query.columns?.split(',');
      const validColumns = columnNames.map(column => queryColumns && queryColumns.includes(column) && column) || [];

      const columnsShowDefault = columnNames.map(column =>
        query[column] && column
      );
      console.log({
        columnsShowDefault,
        validColumns
      });
      setExtraColumns([
        ...columnsShowDefault,
        ...validColumns,
      ]);
    }
  }, [query, columnNames, extraColumns]);
  

  const rowHeader = useDeepCompareCallback((rowData, actionsMenu) => {
    const _props = {
      open: expandedScripture,
      rowData,
      actionsMenu,
      delimiters,
      columnNames,
      bookId,
    };
    return <RowHeader {..._props} />;
  }, [expandedScripture, delimiters, columnNames]);

  const config = useDeepCompareMemo(() => {
    console.log({DefaultColumns: [...new Set([...columnsShowDefaultFromColumnNames({ columnNames }), ...extraColumns])]})
    let _config = {
      rowHeader,
      compositeKeyIndices: compositeKeyIndicesFromColumnNames({ columnNames }),
      columnsFilter: columnsFilterFromColumnNames({ columnNames }),
      columnsShowDefault: [...new Set([...columnsShowDefaultFromColumnNames({ columnNames }), ...extraColumns])],
    };

    return _config;
  }, [columnNames, extraColumns, rowHeader]);

  console.log({ config });
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
      <DataTable
        sourceFile={sourceContent}
        targetFile={cachedContent || targetContent}
        onSave={onSave}
        onEdit={onEdit}
        onValidate={onValidate}
        onContentIsDirty={onContentIsDirty}
        delimiters={delimiters}
        config={config}
        generateRowId={_generateRowId}
        options={options}
        parser={parser}
      />
      {validationComponent}
    </ResourcesContextProvider>
  );
};

TranslatableTSV.propTypes = {
  /** function triggered for save */
  onSave: PropTypes.func.isRequired,
  /** function triggered on edit */
  onEdit: PropTypes.func.isRequired,
  /** function triggered if content is dirty */
  onContentIsDirty: PropTypes.func.isRequired,
};