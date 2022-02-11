import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
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
  loadAuthentication,
  saveAuthentication,
  loadFileCache,
  saveFileCache,
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
  const {
    state,
    state: {
      authentication,
      organization,
      language,
      sourceRepository,
      targetRepository,
      filepath,
      config: _config,
      criticalValidationErrors,
      contentIsDirty,
      cacheFileKey,
      cacheWarningMessage,
    },
    actions,
    actions: {
      setAuthentication: onAuthentication,
      setOrganization: onOrganization,
      setSourceRepository,
      setTargetRepoFromSourceRepo,
      setFilepath,
      setCriticalValidationErrors,
      setCacheFileKey,
      setCacheWarningMessage,
    },
  } = useStateReducer({
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

  const { isConfirmed } = useConfirm({ contentIsDirty });

  const authenticationHook = useAuthentication({
    authentication,
    onAuthentication,
    config: _config.authentication,
    loadAuthentication,
    saveAuthentication,
  });

  const config = authentication?.config || _config.authentication;

  const organizationHook = useOrganization({
    authentication,
    organization,
    onOrganization,
    config,
  });

  const sourceRepositoryHook = useRepository({
    authentication,
    repository: sourceRepository,
    onRepository: setSourceRepository,
    urls: _config.repository.urls,
    config,
  });

  const targetRepositoryHook = useRepository({
    authentication,
    repository: targetRepository,
    onRepository: () => {},
    branch: targetRepository?.branch,
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
        };
      };

      return _cachedFile;
    }
  }, [setCacheFileKey, setCacheWarningMessage]);

  const _onSaveCache = useCallback(({ file, content }) => {
    //console.log("tcc // _onSaveCache", file, content);
    if (file) {
      saveFileCache(file, content);
    }
  }, []);

  const onConfirmClose = () => {
    isConfirmed(localString('ConfirmCloseWindow'));
  };

  const sourceFileHook = useFile({
    config,
    authentication,
    repository: sourceRepository,
    filepath,
    onFilepath: setFilepath,
    // onOpenValidation: _onOpenValidation,
    // onLoadCache: _onLoadCache,
    // onSaveCache: _onSaveCache,
    onConfirmClose,
    releaseFlag: (organization?.username !== 'unfoldingWord') ? true : false,
  });

  let defaultContent;

  if ( sourceRepository?.id === targetRepository?.id ) {
    defaultContent = sourceFileHook?.state?.content;
  } else {
    defaultContent = sourceFileHook?.state?.publishedContent;
    // sourceFile.state.content = defaultContent; // TODO: NEVER SET STATE LIKE THIS
  };

  const targetFileHook = useFile({
    config,
    authentication,
    repository: targetRepository,
    filepath,
    onFilepath: setFilepath,
    defaultContent: defaultContent,
    onOpenValidation: _onOpenValidation,
    onLoadCache: _onLoadCache,
    onSaveCache: _onSaveCache,
  });

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
    giteaReactToolkit: {
      authenticationHook,
      organizationHook,
      sourceRepositoryHook,
      targetRepositoryHook,
      sourceFileHook,
      targetFileHook,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppContextProvider.propTypes = {
  authentication: PropTypes.object,
  language: PropTypes.object,
  sourceRepository: PropTypes.object,
  filepath: PropTypes.string,
  organization: PropTypes.object,
  resourceLinks: PropTypes.array,
  contentIsDirty: PropTypes.bool,
  children: PropTypes.element,
};
