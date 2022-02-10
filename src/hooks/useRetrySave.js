import {
  useState,
  useContext,
} from 'react';
import {
  useDeepCompareCallback,
  useDeepCompareEffect,
} from 'use-deep-compare';

import { parseError } from 'gitea-react-toolkit';

import { AppContext } from '../App.context';

function useRetrySave() {
  const {
    auth,
    targetFile,
  } = useContext(AppContext);

  const [savingTargetFileContent, setSavingTargetFileContent] = useState();
  const [doSaveRetry, setDoSaveRetry] = useState(false);

  const [showAuthenticationDialog, setShowAuthenticationDialog] = useState(false);
  const closeAuthenticationDialog = () => setShowAuthenticationDialog(false);
  const openAuthenticationDialog = () => setShowAuthenticationDialog(true);

  useDeepCompareEffect(() => {
    // This does not work in the saveRetry() function.
    if (doSaveRetry) {
      setDoSaveRetry(false);
      targetFile.actions.save(savingTargetFileContent).then(() => {
        // Saved successfully.
        closeAuthenticationDialog();
      },
      () => {
        // Error saving:
        closeAuthenticationDialog();
        alert('Error saving file! File could not be saved.');
      });
    }
  }, [doSaveRetry, targetFile.actions, savingTargetFileContent]);

  const saveOnTranslation = useDeepCompareCallback( async (content) => {
    setSavingTargetFileContent(content);

    try {
      await targetFile.actions.save(content);
    } catch (error) {
      debugger
      const friendlyError = parseError({ error });

      if (friendlyError.isRecoverable) {
        openAuthenticationDialog();
      } else {
        alert('Error saving file! File could not be saved.');
      };
    };
  }, [targetFile.actions]);

  const autoSaveOnEdit = useDeepCompareCallback( async (content) => {
    //console.log("tC Create / autosave", targetFile, content);
    await targetFile.actions.saveCache(content);
  }, [targetFile.actions]);

  const saveRetry = useDeepCompareCallback( async ({
    username,
    password,
    remember,
  }) => {
    await auth.actions.onLoginFormSubmitLogin({
      username,
      password,
      remember,
    });
    setDoSaveRetry(true);
  }, [auth.actions, setDoSaveRetry]);

  return {
    state: { showAuthenticationDialog },
    actions: {
      autoSaveOnEdit,
      saveOnTranslation,
      setShowAuthenticationDialog,
      openAuthenticationDialog,
      closeAuthenticationDialog,
      saveRetry,
    },
  };
};

export default useRetrySave;
