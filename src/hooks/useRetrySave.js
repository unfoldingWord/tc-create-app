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
import { normalizeNewLine } from "../utils";

function useRetrySave() {
  const {
    giteaReactToolkit: {
      authenticationHook,
      targetFileHook,
    },
    state,
  } = useContext(AppContext);

  const { save, saveCache, savePatch } = targetFileHook.actions || {};
  const { html_url, content: currentContent } = targetFileHook.state || {};
  const { onLoginFormSubmitLogin } = authenticationHook.actions || {};

  const [savingTargetFileContent, setSavingTargetFileContent] = useState();
  const [saveFailed, setSaveFailed] = useState(false);

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
    console.log('targetFileHook changed to.', targetFileHook);
  }, [targetFileHook]);

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

  const saveTranslation = useDeepCompareCallback(async (content, _initialContent) => {
    let saved = false;
    // Check if there are actual changes in the content
    if (content === currentContent) {
      // No changes detected, don't save
      return;
    }

    setSavingTargetFileContent(content);

    try {
      await savePatch(normalizeNewLine(content), normalizeNewLine(_initialContent));
      saved = true;
    } catch (error) {
      const { isRecoverable } = parseError({ error });

      // assumption is that it is an authentication issue.
      if (isRecoverable) {
        openAuthenticationDialog();
      } else {
        setSaveFailed(true);
      };
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
