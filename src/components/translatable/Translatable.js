import React, {
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { CircularProgress } from '@material-ui/core';

import { Translatable as MarkDownTranslatable, MarkdownContextProvider } from 'markdown-translatable';

import { FilesHeader } from '../files-header';
import { AppContext } from '../../App.context';
import useRetrySave from '../../hooks/useRetrySave';
import TranslatableTSV from './TranslatableTSV';

function Translatable() {
  const {
    state: {
      targetRepository,
      sourceRepository,
      filepath,
      selectedFont,
    },
    actions: { setContentIsDirty },
    giteaReactToolkit: {
      sourceFileHook,
      targetFileHook,
    },
  } = useContext(AppContext);

  const { content: sourceFileContent, publishedContent: releasedSourceContent, filepath: sourceFilepath } = sourceFileHook.state || {};
  const { content: targetFileContent, filepath: targetFilepath } = targetFileHook.state || {};

  const {
    actions: {
      autoSaveOnEdit,
      saveTranslation,
    },
    component: authenticationDialog,
  } = useRetrySave();

  const scrollToTop = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);

  const filepathsMatch = (
    filepath &&
    filepath === sourceFilepath &&
    filepath === targetFilepath
  );

  const translatableComponent = useMemo(() => {
    let _translatable = (
      <div style={{ textAlign: 'center' }}>
        <CircularProgress />{' '}
      </div>
    );
    // console.log("filepathsMatch=", filepathsMatch)
    // console.log("sourceFileContent", sourceFileContent)
    // console.log("releasedSourceContent", releasedSourceContent)
    // console.log("sourceFileHook:", sourceFileHook)
    // console.log("targetFileContent", targetFileContent)
    if (
      filepathsMatch &&
      (sourceFileContent || releasedSourceContent) &&
      targetFileContent
    ) {
      if (filepath.match(/\.md$/)) {

        let translatableProps = {
          original: sourceFileContent ? sourceFileContent : releasedSourceContent,
          translation: targetFileContent,
          onTranslation: saveTranslation,
          onContentIsDirty: setContentIsDirty,
          translationFontFamily: selectedFont,
        };
        console.log('Markdown file selected');
        _translatable = <MarkdownContextProvider><MarkDownTranslatable {...translatableProps} /></MarkdownContextProvider>;
      } else if (filepath.match(/\.tsv$/)) {
        console.log('TSV file selected');
        const onSave = function (...args) {
          saveTranslation(...args);
        }
        const onEdit = function (...args) {
          autoSaveOnEdit(...args);
        }
        const onContentIsDirty = function (...args) {
          setContentIsDirty(...args);
        }
        _translatable = <TranslatableTSV onSave={onSave} onEdit={onEdit} onContentIsDirty={onContentIsDirty} />;
      } else {
        console.log('Unsupported file selected');
        _translatable = <h3 style={{ 'textAlign': 'center' }} >Unsupported File. Please select .md or .tsv files.</h3>;
      };
    };
    return _translatable;
  }, [
    filepath,
    filepathsMatch,
    sourceFileContent,
    releasedSourceContent,
    targetFileContent,
    setContentIsDirty,
    saveTranslation,
    autoSaveOnEdit,
    selectedFont,
  ]);

  useEffect(() => {
    scrollToTop();
  }, [filepath, scrollToTop]);

  const filesHeader = (targetRepository && targetFileHook.state && sourceRepository ) ? <FilesHeader /> : <></>;

  return (
    <div id='translatable'>
      {filesHeader}
      <div id='translatableComponent'>
        {translatableComponent}
      </div>
      {authenticationDialog}
    </div>
  );
};

export default Translatable;
