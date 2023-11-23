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
    if (
      filepathsMatch &&
      (sourceFileContent || releasedSourceContent) &&
      targetFileContent
    ) {
      const organizationName = targetRepository?.full_name.split('/')[0]?.toLowerCase();
      if (filepath.match(/\.md$/)) {

        let translatableProps = {
          original: organizationName === "unfoldingword" ? sourceFileContent:releasedSourceContent,
          translation: targetFileContent,
          onTranslation: saveTranslation,
          onContentIsDirty: setContentIsDirty,
          translationFontFamily: selectedFont,
        };
        _translatable = <MarkdownContextProvider><MarkDownTranslatable {...translatableProps} /></MarkdownContextProvider>;
      } else if (filepath.match(/\.tsv$/)) {
        const onSave = async function (...args) {
          const saved = await saveTranslation(...args);
          return saved;
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
    targetRepository.full_name
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
