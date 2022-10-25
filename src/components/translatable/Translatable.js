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
      filepath,
      selectedFont,
    },
    actions: { setContentIsDirty },
    giteaReactToolkit: {
      sourceFileHook,
      targetFileHook,
    },
  } = useContext(AppContext);

  const { content: sourceFileContent, filepath: sourceFilepath } = sourceFileHook.state || {};
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

    if (
      filepathsMatch &&
      sourceFileContent &&
      targetFileContent
    ) {
      console.log('translatableComponent', selectedFont)
      if (filepath.match(/\.md$/)) {

        let translatableProps = {
          original: sourceFileContent,
          translation: targetFileContent,
          onTranslation: saveTranslation,
          onContentIsDirty: setContentIsDirty,
          translationFontFamily: selectedFont,
        };
        console.log('Markdown file selected');
        _translatable = <MarkdownContextProvider><MarkDownTranslatable {...translatableProps} /></MarkdownContextProvider>;
      } else if (filepath.match(/\.tsv$/)) {
        console.log('TSV file selected');
        _translatable = <TranslatableTSV onSave={saveTranslation} onEdit={autoSaveOnEdit} onContentIsDirty={setContentIsDirty} />;
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
    targetFileContent,
    setContentIsDirty,
    saveTranslation,
    autoSaveOnEdit,
    selectedFont,
  ]);

  useEffect(() => {
    scrollToTop();
  }, [filepath, scrollToTop]);

  const filesHeader = (targetRepository && targetFileHook.state) ? <FilesHeader /> : <></>;

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
