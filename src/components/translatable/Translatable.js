import React, {
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';
import { CircularProgress } from '@material-ui/core';

import { Translatable as MarkDownTranslatable, MarkdownContextProvider } from 'markdown-translatable';

import { FilesHeader } from '../files-header';
import { AppContext } from '../../App.context';
import useRetrySave from '../../hooks/useRetrySave';
import AuthenticationDialog from '../dialogs/AuthenticationDialog';
import TranslatableTSV from './TranslatableTSV';

function Translatable() {
  const {
    state: {
      targetRepository,
      filepath,
    },
    actions: { setContentIsDirty },
    sourceFile,
    targetFile,
  } = useContext(AppContext);

  const {
    state: { showAuthenticationDialog },
    actions: {
      autoSaveOnEdit,
      saveOnTranslation,
      openAuthenticationDialog,
      closeAuthenticationDialog,
      saveRetry,
    },
  } = useRetrySave();


  const scrollToTop = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);

  const translatableComponent = useDeepCompareMemo(() => {
    let _translatable = (
      <div style={{ textAlign: 'center' }}>
        <CircularProgress />{' '}
      </div>
    );

    if (
      filepath &&
      sourceFile.state?.content &&
      targetFile.state?.content &&
      filepath === sourceFile.state?.filepath &&
      filepath === targetFile.state?.filepath
    ) {
      if (filepath.match(/\.md$/)) {
        let translatableProps = {
          original: sourceFile?.state?.content,
          translation: targetFile?.state?.content,
          onTranslation: saveOnTranslation,
          onContentIsDirty: setContentIsDirty,
        };
        console.log('Markdown file selected');
        _translatable = <MarkdownContextProvider><MarkDownTranslatable {...translatableProps} /></MarkdownContextProvider>;
      } else if (filepath.match(/\.tsv$/)) {
        console.log('tn 9 col file selected');
        _translatable = <TranslatableTSV onSave={saveOnTranslation} onEdit={autoSaveOnEdit} onContentIsDirty={setContentIsDirty} />;
      } else {
        console.log('Unsupported file selected');
        _translatable = <h3 style={{ 'textAlign': 'center' }} >Unsupported File. Please select .md or .tsv files.</h3>;
      }
    };
    return _translatable;
  }, [
    filepath,
    sourceFile.state.filepath,
    sourceFile.state.content,
    targetFile.state.filepath,
    targetFile.state.content,
    setContentIsDirty,
    saveOnTranslation,
    autoSaveOnEdit,
  ]);

  useEffect(() => {
    scrollToTop();
  }, [filepath, scrollToTop]);

  const filesHeader = targetRepository && targetFile && <FilesHeader />;

  return (
    <div id='translatable'>
      {filesHeader}
      <div id='translatableComponent'>
        {translatableComponent}
      </div>
      <AuthenticationDialog
        show={showAuthenticationDialog}
        open={openAuthenticationDialog}
        close={closeAuthenticationDialog}
        saveRetry={saveRetry}
      />
    </div>
  );
};

export default Translatable;
