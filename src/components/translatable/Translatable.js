import React, {
  useMemo,
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
import { FileContext, AuthenticationContext, LoginForm } from 'gitea-react-toolkit';
import { Translatable as MarkDownTranslatable } from 'markdown-translatable';

import { FilesHeader } from '../files-header';
import { AppContext } from '../../App.context';
import { TargetFileContext } from '../../core/TargetFile.context';
import TranslatableTSV from './TranslatableTSV';

function Translatable() {
  const classes = useStyles();
  const [wrapperElement, setWrapperElement] = useState(null);

  const { state: config } = useContext(AppContext);

  const { component: authenticationComponent, actions: authenticationActions, state: authentication } = useContext(AuthenticationContext);

  const [savingTargetFileContent, setSavingTargetFileContent] = useState();
  const [doSaveRetry, setDoSaveRetry] = useState(false);

  const [isAuthenticationModalVisible, setAuthenticationModalVisible] = useState(false);
  const closeAuthenticationModal = () => setAuthenticationModalVisible(false);
  const openAuthenticationModal = () => setAuthenticationModalVisible(true);

  const {
    state: {
      language, sourceRepository, targetRepository, filepath,
    },
  } = useContext(AppContext);

  const { state: sourceFile } = useContext(FileContext);

  const { state: targetFile, actions: targetFileActions } = useContext(
    TargetFileContext
  );

  useEffect(() => {
    if (isAuthenticationModalVisible && authentication && authentication.user) {
      if (savingTargetFileContent) {
        closeAuthenticationModal();
      }
    }
  }, [authentication, targetFile, targetFileActions, targetFileActions.save]);

  useEffect(() => {
    // This does not work in the saveRetry() function.
    if (doSaveRetry) {
      setDoSaveRetry(false);

      targetFileActions.save(savingTargetFileContent)
        .then(() => {
          // Saved successfully.
        },
          () => {
            // Error saving:
            alert("Error saving file! File could not be saved.");
          });
    }
  }, [doSaveRetry]);

  const authenticationModal = useMemo(() => {
    const saveRetry = ({ username, password, remember }) => {
      authenticationActions.onLoginFormSubmitLogin({ username, password, remember })
        .then(() => {
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
  }, [config, isAuthenticationModalVisible, classes.modal,
    , authenticationActions, authenticationActions.onLoginFormSubmitLogin
    , targetFile, targetFileActions, targetFileActions.save, savingTargetFileContent]);

  const scrollToTop = useCallback(() => {
    if (wrapperElement && wrapperElement) {
      window.scrollTo(0, wrapperElement.offsetParent.offsetTop);
    }
  }, [wrapperElement]);

  const translatableComponent = useMemo(() => {
    let _translatable = (
      <div style={{ textAlign: 'center' }}>
        <CircularProgress />{' '}
      </div>
    );

    const saveOnTranslation = (
      async (content) => {
        setSavingTargetFileContent(content);

        try {
          await targetFileActions.save(content);
        } catch (error) {
          openAuthenticationModal();
        }
      }
    );

    if (
      filepath &&
      sourceFile &&
      targetFile &&
      filepath === sourceFile.filepath &&
      filepath === targetFile.filepath
    ) {
      if (sourceFile.filepath.match(/\.md$/)) {
        let translatableProps = {
          original: sourceFile.content,
          translation: targetFile.content,
          onTranslation: saveOnTranslation,
        };
        _translatable = <MarkDownTranslatable {...translatableProps} />;
      } else if (sourceFile.filepath.match(/\.tsv$/)) {
        _translatable = <TranslatableTSV onSave={saveOnTranslation} />;
      } else {
        _translatable = <h3 style={{ 'textAlign': 'center' }} >Unsupported File. Please select .md or .tsv files.</h3>;
      }
    }
    return _translatable;
  }, [config, authentication, filepath, sourceFile, targetFile, targetFileActions]);

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
    }
  }));

export default Translatable;
