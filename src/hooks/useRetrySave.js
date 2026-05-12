import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useDeepCompareCallback, useDeepCompareEffect } from 'use-deep-compare';

import { parseError } from 'gitea-react-toolkit';
import AuthenticationDialog from '../components/dialogs/AuthenticationDialog';
import { AppContext } from '../App.context';

/**
 * Returns true when the error is likely a file-save conflict (stale SHA,
 * missing branch, or permission denied) rather than a network or auth issue.
 *
 * gitea-react-toolkit's saveFile() collapses all HTTP failures from the
 * Gitea Contents API into the generic message "Error creating file.", so we
 * cannot inspect an HTTP status code here.  The eager branch-creation in
 * useStateReducer (issue #1712 fix) should prevent most stale-SHA conflicts,
 * but this check keeps the fallback UX honest when an unexpected save failure
 * does slip through.
 */
const isSaveConflict = (error) =>
  error && error.message && error.message.includes('Error creating file.');

function useRetrySave() {
  const {
    giteaReactToolkit: {
      authenticationHook,
      targetFileHook,
    },
    state,
  } = useContext(AppContext);

  const { save, saveCache } = targetFileHook.actions || {};
  const { html_url, content: currentContent } = targetFileHook.state || {};
  const { onLoginFormSubmitLogin } = authenticationHook.actions || {};

  const [savingTargetFileContent, setSavingTargetFileContent] = useState();
  const [saveFailed, setSaveFailed] = useState(false);
  const [saveConflict, setSaveConflict] = useState(false);

  const [showAuthenticationDialog, setShowAuthenticationDialog] = useState(false);

  // Track authentication state for retry logic after re-login
  // Fixes issue #1694: Re-login screen does not save when session expires
  const authentication = state.authentication;
  const authTokenRef = useRef(authentication?.token?.sha1);
  const pendingSaveContentRef = useRef(null);

  const openAuthenticationDialog = useCallback(() => {
    setShowAuthenticationDialog(true);
  }, []);

  const closeAuthenticationDialog = useCallback(() => {
    setShowAuthenticationDialog(false);
  }, []);

  useEffect(() => {
    if (saveFailed) {
      alert('Error saving file! File could not be saved.');
    };
  }, [saveFailed]);

  useEffect(() => {
    if (saveConflict) {
      // The file on the server has changed since it was loaded (stale SHA).
      // Prompt the user to reload so they work from the latest version.
      const reload = window.confirm(
        'The file could not be saved because the server copy has changed since you opened it.\n\n' +
        'Click OK to reload the page and re-open the latest version, or Cancel to stay and try saving again.'
      );
      if (reload) {
        window.location.reload();
      } else {
        setSaveConflict(false);
      }
    }
  }, [saveConflict]);

  // Watch for authentication changes and retry save when auth is restored
  // This ensures the save function has fresh credentials after re-login
  useDeepCompareEffect(() => {
    const currentToken = authentication?.token?.sha1;
    const tokenChanged = currentToken && currentToken !== authTokenRef.current;
    authTokenRef.current = currentToken;

    if (tokenChanged && pendingSaveContentRef.current) {
      const contentToSave = pendingSaveContentRef.current;
      pendingSaveContentRef.current = null;

      save(contentToSave)
        .then(() => closeAuthenticationDialog())
        .catch(() => {
          setSaveFailed(true);
          closeAuthenticationDialog();
        });
    }
  }, [authentication, save, closeAuthenticationDialog]);

  const saveTranslation = useDeepCompareCallback(async (content) => {
    let saved = false;
    // Check if there are actual changes in the content
    if (content === currentContent) {
      // No changes detected, don't save
      return;
    }

    setSavingTargetFileContent(content);

    try {
      await save(content);
      saved = true;
    } catch (error) {
      // Distinguish save conflicts (stale SHA / branch missing) from genuine
      // network/auth failures so we don't show a misleading login dialog.
      // See: https://github.com/unfoldingWord/tc-create-app/issues/1712
      if (isSaveConflict(error)) {
        setSaveConflict(true);
      } else {
        const { isRecoverable } = parseError({ error });

        if (isRecoverable) {
          // Treat as a recoverable auth issue and offer re-login.
          openAuthenticationDialog();
        } else {
          setSaveFailed(true);
        }
      }
    };
    return saved;
  }, [save, currentContent, openAuthenticationDialog]);

  const autoSaveOnEdit = useCallback(async (content) => {
    if (html_url.includes(state?.targetRepository?.branch)) {
      // We are using a user branch so autosave the cache.
      await saveCache(content);
    }
  }, [saveCache, state, html_url]);

  const saveRetry = useCallback(async ({
    username,
    password,
    remember,
  }) => {
    // Store content to save after auth completes
    // The useDeepCompareEffect will detect the token change and retry the save
    pendingSaveContentRef.current = savingTargetFileContent;
    await onLoginFormSubmitLogin({
      username,
      password,
      remember,
    });
  }, [onLoginFormSubmitLogin, savingTargetFileContent]);

  const component = useMemo(() => (
    <AuthenticationDialog
      show={showAuthenticationDialog}
      open={openAuthenticationDialog}
      close={closeAuthenticationDialog}
      saveRetry={saveRetry}
    />
  ), [saveRetry, showAuthenticationDialog, openAuthenticationDialog, closeAuthenticationDialog]);

  return {
    actions: {
      autoSaveOnEdit,
      saveTranslation,
    },
    component,
  };
};

export default useRetrySave;
