import React, {
  useState,
  useCallback,
} from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';

import {
  useAuthentication,
  useOrganization,
  useRepository,
  useFile,
} from 'gitea-react-toolkit';
import { useLanguages } from 'uw-languages-rcl';
import { useStateReducer } from './core/useStateReducer';

import {
  // loadState,
  loadAuthentication,
  saveAuthentication,
  loadFileCache,
  saveFileCache,
  // removeFileCache,
} from './core/persistence';

import { onOpenValidation } from './core/onOpenValidations';
import useConfirm from './hooks/useConfirm';
import { localString } from './core/localStrings';

export const AppContext = React.createContext();

export function AppContextProvider({
  authentication: _authentication,
  language: _language,
  sourceRepository: _sourceRepository,
  filepath: _filepath,
  organization: _organization,
  resourceLinks: _resourceLinks,
  contentIsDirty: _contentIsDirty,
  children,
}) {
  // State for autosave
  const [cacheFileKey, setCacheFileKey] = useState('');
  const [cacheWarningMessage, setCacheWarningMessage] = useState();

  const [state, actions] = useStateReducer({
    authentication: _authentication,
    language: _language,
    sourceRepository: _sourceRepository,
    filepath: _filepath,
    organization: _organization,
    resourceLinks: _resourceLinks,
    contentIsDirty: _contentIsDirty,
  });
  // uw-languages-rcl
  const { state: languages } = useLanguages();

  const {
    authentication,
    organization,
    language,
    sourceRepository,
    targetRepository,
    filepath,
    config: _config,
    criticalValidationErrors,
    contentIsDirty,
  } = state;

  const {
    setAuthentication: onAuthentication,
    setOrganization: onOrganization,
    setSourceRepository,
    setTargetRepository,
    setTargetRepoFromSourceRepo,
    setFilepath,
    setCriticalValidationErrors,
  } = actions;

  const auth = useAuthentication({
    authentication,
    onAuthentication,
    config: _config.authentication,
    loadAuthentication,
    saveAuthentication,
  });

  const config = authentication?.config || _config.authentication;

  const org = useOrganization({
    authentication,
    organization,
    onOrganization,
    config,
  });

  const sourceRepo = useRepository({
    authentication,
    repository: sourceRepository,
    onRepository: setSourceRepository,
    urls: _config.repository.urls,
    config,
  });

  const targetRepo = useRepository({
    authentication,
    repository: targetRepository,
    onRepository: setTargetRepository,
    urls: _config.repository.urls,
    config,
  });

  const _onOpenValidation = (filename, content, url) => {
    const notices = onOpenValidation(filename, content, url);

    if (notices.length > 0) {
      setCriticalValidationErrors(notices);
    } else {
      setCriticalValidationErrors([]);
    }
    return notices;
  };

  const _onLoadCache = useCallback( async ({ html_url, file }) => {
    if (html_url) {
      let _cachedFile = await loadFileCache(html_url);

      if (_cachedFile && file) {
        // console.log("tcc // file", file, html_url);
        // console.log("tcc // cached file", _cachedFile);

        if (_cachedFile?.sha && file?.sha && _cachedFile?.sha !== file?.sha) {
          // Allow app to provide CACHED ("offline" content);
          // Might be different BRANCH (different user) or different FILE.
          // Might be STALE (sha has changed on DCS).
          // (NOTE: STALE cache would mean THIS user edited the same file in another browser.)

          const cacheWarningMessage =
            'AutoSaved file: \n' + //_cachedFile.filepath + ".\n" +
            'Edited: ' + _cachedFile.timestamp?.toLocaleString() + '\n' +
            'Checksum: ' + _cachedFile.sha + '\n\n' +
            'Server file (newer): \n' + //file.name + ".\n" +
            'Checksum: ' + file.sha + '\n\n';

          setCacheFileKey(html_url);
          setCacheWarningMessage(cacheWarningMessage);
        }
      };

      return _cachedFile;
    }
  }, []);

  const _onSaveCache = useCallback(({ file, content }) => {
    //console.log("tcc // _onSaveCache", file, content);
    if (file) {
      saveFileCache(file, content);
    }
  }, []);

  const { isConfirmed } = useConfirm({ contentIsDirty });

  const onConfirmClose = () => {
    isConfirmed(localString('ConfirmCloseWindow'));
  };

  const sourceFile = useFile({
    authentication,
    repository: sourceRepository,
    filepath,
    onFilepath: setFilepath,
    onOpenValidation: _onOpenValidation,
    onLoadCache: _onLoadCache,
    onSaveCache: _onSaveCache,
    onConfirmClose,
    releaseFlag: (organization?.username !== 'unfoldingWord') ? true : false,
    config,
  });

  let _defaultContent;

  if ( sourceRepository?.id === targetRepository?.id ) {
    _defaultContent = sourceFile?.content;
  } else {
    _defaultContent = sourceFile?.publishedContent;
    sourceFile.content = _defaultContent;
  };

  const targetFile = useFile({
    config,
    authentication,
    repository: targetRepository,
    filepath,
    onFilepath: setFilepath,
    defaultContent: _defaultContent,
    onOpenValidation: onOpenValidation,
    // Pass cache actions from the app's FileContext (happens to be SOURCE).
    // Sharing actions allows the app to use onCacheChange events.
    onLoadCache: sourceFile.actions.onLoadCache,
    onSaveCache: sourceFile.actions.onSaveCache,
    onConfirmClose: null,
  });

  debugger

  useDeepCompareEffect(() => {
    if (authentication && sourceRepository && organization) {
      setTargetRepoFromSourceRepo({
        authentication,
        sourceRepository,
        language,
        organization,
      });
    }
  }, [
    setTargetRepoFromSourceRepo,
    authentication,
    sourceRepository,
    language,
    organization,
  ]);

  const value = {
    state: {
      ...state,
      languages,
      criticalValidationErrors,
      cacheFileKey,
      cacheWarningMessage,
    },
    actions: {
      ...actions,
      setCacheFileKey,
    },
    auth,
    org,
    sourceRepo,
    targetRepo,
    sourceFile,
    targetFile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
