import React, {
  useEffect,
  useCallback,
  useState,
  useContext,
} from 'react';
import {
  Modal,
  Paper,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDeepCompareEffect, useDeepCompareMemo } from 'use-deep-compare';

import { LoginForm, parseError } from 'gitea-react-toolkit';
import { Translatable as MarkDownTranslatable, MarkdownContextProvider } from 'markdown-translatable';

import { FilesHeader } from '../files-header';
import { AppContext } from '../../App.context';
import TranslatableTSV from './TranslatableTSV';

function Translatable() {
  const classes = useStyles();
  //const [wrapperElement, setWrapperElement] = useState(null);

  const {
    state: {
      config,
      targetRepository,
      filepath,
    },
    actions: { setContentIsDirty },
    auth,
    sourceFile,
    targetFile,
  } = useContext(AppContext);

  const [savingTargetFileContent, setSavingTargetFileContent] = useState();
  const [doSaveRetry, setDoSaveRetry] = useState(false);

  const [isAuthenticationModalVisible, setAuthenticationModalVisible] = useState(false);
  const closeAuthenticationModal = () => setAuthenticationModalVisible(false);
  const openAuthenticationModal = () => setAuthenticationModalVisible(true);

  useDeepCompareEffect(() => {
    // This does not work in the saveRetry() function.
    if (doSaveRetry) {
      setDoSaveRetry(false);

      targetFile.actions.save(savingTargetFileContent).then(() => {
        // Saved successfully.
        closeAuthenticationModal();
      },
      () => {
        // Error saving:
        closeAuthenticationModal();
        alert('Error saving file! File could not be saved.');
      });
    }
  }, [doSaveRetry, targetFile.actions, savingTargetFileContent]);

  const authenticationModal = useDeepCompareMemo(() => {
    const saveRetry = ({
      username, password, remember,
    }) => {
      auth.actions.onLoginFormSubmitLogin({
        username, password, remember,
      }).then(() => {
        setDoSaveRetry(true);
      });
    };

    return (
      (!isAuthenticationModalVisible) ? <></> : (
        <Modal open={true} onClose={closeAuthenticationModal}>
          <Paper className={classes.modal}>
            <LoginForm
              config={config}
              authentication={null/** Override to simulate logged out. */}
              actionText={'Login to try again...'}
              errorText={'Error! File was not saved.  Connection to the server was lost.'}
              onSubmit={saveRetry}
            />
          </Paper>
        </Modal>
      )
    );
  }, [config, isAuthenticationModalVisible, classes.modal, auth.actions]);

  const scrollToTop = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);

  const translatableComponent = useDeepCompareMemo(() => {
    let _translatable = (
      <div style={{ textAlign: 'center' }}>
        <CircularProgress />{' '}
      </div>
    );

    const saveOnTranslation = ( async (content) => {
      setSavingTargetFileContent(content);

      try {
        await targetFile.actions.save(content);
      } catch (error) {
        const friendlyError = parseError({ error });

        if (friendlyError.isRecoverable) {
          openAuthenticationModal();
        } else {
          alert('Error saving file! File could not be saved.');
        }
      }
    });

    const autoSaveOnEdit = async (content) => {
      //console.log("tC Create / autosave", targetFile, content);
      await targetFile.actions.saveCache(content);
    };

    if (
      filepath &&
      sourceFile?.state?.content &&
      targetFile?.state?.content &&
      filepath === sourceFile?.state?.filepath &&
      filepath === targetFile?.state?.filepath
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
  }, [filepath, sourceFile, targetFile, setContentIsDirty]);

  useEffect(() => {
    scrollToTop();
  }, [filepath, scrollToTop]);

  //console.log("targetFile");
  //console.log(targetFile);
  //console.log("targetRepository");
  //console.log(targetRepository);

  const filesHeader = targetRepository && targetFile && <FilesHeader />;

  return (
    <div className={classes.root}>
      {filesHeader}
      <div id='translatableComponent'>
        {translatableComponent}
      </div>
      {authenticationModal}
    </div>
  );
}

const useStyles = makeStyles((theme) => (
  {
    root: {},
    modal: {
      position: 'absolute',
      top: '10%',
      left: '10%',
      right: '10%',
      maxHeight: '80%',
      overflow: 'scroll',
    },
  }));

export default Translatable;
