import React, { useMemo, useEffect, useCallback, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FileContext } from 'gitea-react-toolkit';
import { Translatable as MarkDownTranslatable } from 'markdown-translatable';
import { DataTable } from 'datatable-translatable';

import RowHeader from './RowHeader';
import { FilesHeader } from '../files-header';
import { AppContext } from '../../App.context';
import { TargetFileContext } from '../../core/TargetFile.context';

function Translatable() {
  const classes = useStyles();
  const [wrapperElement, setWrapperElement] = useState(null);
  const {
    state: {
      language, sourceRepository, targetRepository, filepath,
    },
  } = useContext(AppContext);
  const { state: sourceFile } = useContext(FileContext);

  const { state: targetFile, actions: targetFileActions } = useContext(TargetFileContext);

  const scrollToTop = useCallback(() => {
    if (wrapperElement && wrapperElement) {
      window.scrollTo(0, wrapperElement.offsetParent.offsetTop);
    }
  }, [wrapperElement]);

  const translatableComponent = useMemo(() => {
    let _translatable = <h3>Unsupported File. Please select .md or .tsv files.</h3>;
    if (filepath && sourceFile && targetFile && (filepath === sourceFile.filepath) && (filepath === targetFile.filepath)) {
      if (sourceFile.filepath.match(/\.md$/)) {
        let translatableProps = {
          original: sourceFile.content,
          translation: targetFile.content,
          onTranslation: targetFileActions.save,
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
          onSave: targetFileActions.save,
          delimiters,
          config,
        };
        _translatable = <DataTable {...translatableProps} />;
      }
    }
    return _translatable;
  }, [filepath, sourceFile, targetFile, targetFileActions.save]);

  useEffect(() => {
    if (targetFile) {
      scrollToTop();
    }
  }, [targetFile, scrollToTop]);

  const filesHeader = targetFile && (
    <FilesHeader
      sourceRepository={sourceRepository}
      targetRepository={targetRepository}
      sourceFile={sourceFile}
      targetFile={targetFile}
      language={language}
    />
  );

  return (
    <div ref={setWrapperElement} className={classes.root}>
      {filesHeader}
      {translatableComponent}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
  },
}));

export default Translatable;