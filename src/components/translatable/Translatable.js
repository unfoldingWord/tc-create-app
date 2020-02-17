import React, { useMemo, useEffect,  useCallback, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Translatable as MarkDownTranslatable } from 'markdown-translatable';
import { DataTable } from 'datatable-translatable';

import RowHeader from './RowHeader';
import { FilesHeader } from '../files-header';
function Translatable({
  sourceRepository,
  targetRepository,
  sourceFile,
  targetFile,
  language,
}) {
  const [dataTableElement, setDataTableElement] = useState();
  const classes = useStyles();

  const scrollToTop = useCallback(() => {
    if (dataTableElement && dataTableElement.tableRef) {
      window.scrollTo(0, dataTableElement.tableRef.offsetParent.offsetTop);
    }
  }, []);

  const translatableComponent = useMemo(() => {
    let _translatable = <h3>Unsupported File. Please select .md or .tsv files.</h3>;
    if (sourceFile && targetFile && sourceFile.content && targetFile.content) {
      if (sourceFile.filepath.match(/\.md$/)) {
        let translatableProps = {
          original: sourceFile.content,
          translation: targetFile.content,
          onTranslation: targetFile.saveContent,
        };
        _translatable = <MarkDownTranslatable {...translatableProps} />;
      } else if (sourceFile.filepath.match(/\.tsv$/)) {
        const delimiters = { row: '\n', cell: '\t' };
        const rowHeader = (rowData, actionsMenu) => (
          <RowHeader rowData={rowData} actionsMenu={actionsMenu} delimiters={delimiters} />
        );
        const config = {
          compositeKeyIndices: [0, 1, 2, 3],
          columnsFilter: ['Chapter', 'SupportReference'],
          columnsShowDefault: ['SupportReference', 'OrigQuote', 'Occurrence', 'OccurrenceNote'],
          rowHeader,
        };
        let translatableProps = {
          sourceFile: sourceFile.content,
          targetFile: targetFile.content,
          onSave: targetFile.saveContent,
          delimiters,
          config,
        };
        _translatable = <DataTable onRef={setDataTableElement} {...translatableProps} />;
      }
    }
    return _translatable;
  }, [sourceFile, targetFile]);

  useEffect(() => {
    if (sourceFile && targetFile && sourceFile.content && targetFile.content) {
      scrollToTop();
    }
  }, [sourceFile, scrollToTop, targetFile])

  return (
    <div className={classes.root}>
      <FilesHeader
        sourceRepository={sourceRepository}
        targetRepository={targetRepository}
        sourceFile={sourceFile}
        targetFile={targetFile}
        language={language}
      />
      {translatableComponent}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
  },
}));

export default Translatable;