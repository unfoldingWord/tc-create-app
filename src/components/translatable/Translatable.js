import React, { useMemo, useEffect, useCallback, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FileContext } from 'gitea-react-toolkit';
import { Translatable as MarkDownTranslatable } from 'markdown-translatable';
import { DataTable } from 'datatable-translatable';

import RowHeader from './RowHeader';
import { FilesHeader } from '../files-header';
import { AppContext } from '../../App.context';
import { TargetFileContext } from '../../core/TargetFile.context';
import { ResourcesContextProvider } from "scripture-resources-rcl";

import { testament } from '../../core/bcv.js';
import { SERVER_URL } from '../../core/state.defaults';


function Translatable() {
  const classes = useStyles();
  const [wrapperElement, setWrapperElement] = useState(null);

  // manage the state of the resources for the provider context
  const [ resources, setResources ] = React.useState([]);

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
        const bookId = sourceFile.filepath.split(/\d+-|\./)[1].toLowerCase();
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
        const reference = { bookId };
        const _testament = testament(reference);
        let hebrewLink = 'unfoldingWord/hbo/uhb/master';
        let greekLink = 'unfoldingWord/el-x-koine/ugnt/master';
        let originalLink = (_testament === 'old') ? hebrewLink : greekLink;
      
        // need to add reference bookId to resource links
        const _resourceLinks = [
          originalLink,
          'unfoldingWord/en/ult/master',
          'unfoldingWord/en/ust/master',
        ];
        const resourceLinks = _resourceLinks.map( (link) => {
          return link+'/'+bookId;
        });
      
        const serverConfig = { 
          server: SERVER_URL,
          cache: {
            maxAge: 1 * 1 * 1 * 60 * 1000, // override cache to 1 minute
          },
        };

        _translatable = (
          <ResourcesContextProvider
            resourceLinks={resourceLinks}
            resources={resources}
            onResources={setResources}
            config={serverConfig}
          >
            <DataTable {...translatableProps} />
          </ResourcesContextProvider>
        );
      }
    }
    return _translatable;
  }, [filepath, sourceFile, targetFile, targetFileActions.save, resources]);

  useEffect(() => {
      scrollToTop();
  }, [filepath, scrollToTop]);

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