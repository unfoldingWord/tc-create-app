import React, {
  useState,
  useCallback,
  useContext,
  useMemo,
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

import {
  columnNamesFromContent,
  columnsFilterFromColumnNames,
  columnsShowDefaultFromColumnNames,
  compositeKeyIndicesFromColumnNames,
  generateRowId,
} from './helpers';
import ChapterVerseFilters from './ChapterVerseFilters';

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
      selectedFont,
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
    publishedContent: releasedSourceContent,
  } = sourceFileHook.state || {};
  const { content: targetContent } = targetFileHook.state || {};
  const { content: cachedContent } = cachedFile || {};
  console.log("TranslatableTSV() sourceContent, publishedContent:", sourceContent, releasedSourceContent)
  const columnNames = useMemo(() => {
    const _content = sourceContent || releasedSourceContent;
    const _columnNames = columnNamesFromContent({ content: _content, delimiters });
    return _columnNames;
  }, [sourceContent, releasedSourceContent]);

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

  const options = {
    page: 0,
    rowsPerPage: 25,
    rowsPerPageOptions: [10, 25, 50, 100],
  };

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
    let _config = {
      rowHeader,
      compositeKeyIndices: compositeKeyIndicesFromColumnNames({ columnNames }),
      columnsFilter: columnsFilterFromColumnNames({ columnNames }),
      columnsShowDefault: columnsShowDefaultFromColumnNames({ columnNames }),
    };

    return _config;
  }, [columnNames, rowHeader]);

  const REF_FILTER_INDEX = 1;

  const chapterVerseFilter = {
    name: "ChapterVerse",
    options: {
      empty: true,
      display: "excluded",
      filterType: "custom",
      filterOptions: {
        //TODO: modify logic to allow search strings like `1:5-6`, etc.
        logic: (location, filters, row) => {
          if (filters.length) return !filters.includes(row[0]);
          return false;
        },
        display: (filterList, onChange, _index, column, filterData) => {
          const filterValues = filterData[REF_FILTER_INDEX].reduce(
            (cv, reference, i) => {
              const [chapter, verse] = reference.match(/(?:\\t)*([\d\w]+):([\d\w]+)/)?.[0].split(":");
              if(!cv[chapter]) cv[chapter] = [];
              cv[chapter].push(verse)
              return cv;
            },
            {}
          );
          const index = REF_FILTER_INDEX;
          console.log({ filterList, onChange, index, column, filterData });
          const optionValues = filterValues;
          return <ChapterVerseFilters onChange={onChange} cvData={optionValues} filters={filterList} index={index}/>
        },
        fullWidth: true
      }
    }
  }

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
        sourceFile={sourceContent || releasedSourceContent}
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
        columns={[chapterVerseFilter]}
        translationFontFamily={selectedFont}
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
