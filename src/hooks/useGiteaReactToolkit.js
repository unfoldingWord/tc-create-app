import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDeepCompareEffect, useDeepCompareMemo } from 'use-deep-compare';

import {
  useAuthentication,
  useOrganization,
  useRepository,
  useFile,
} from 'gitea-react-toolkit';

import {
  loadAuthentication,
  saveAuthentication,
  loadFileCache,
  saveFileCache,
} from '../core/persistence';

import { onOpenValidation } from '../core/onOpenValidations';
import useConfirm from '../hooks/useConfirm';
import { localString } from '../core/localStrings';

export function useGiteaReactToolkit(applicationStateReducer) {
  const {
    state: {
      authentication,
      organization,
      language,
      sourceRepository,
      targetRepository,
      filepath,
      config: _config,
      contentIsDirty,
      cachedFile,
    },
    actions: {
      setAuthentication: onAuthentication,
      setOrganization: onOrganization,
      setSourceRepository,
      setTargetRepoFromSourceRepo,
      setFilepath,
      setCriticalValidationErrors,
      setCacheFileKey,
      setCacheWarningMessage,
      setCachedFile,
      clearCachedFile,
    },
  } = applicationStateReducer;

  console.log("ssssssssssssssssssssssssss", sourceRepository);
  console.log("tttttttttttttttttttttttttt", sourceRepository);


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
    onRepository: () => { },
    branch: targetRepository?.branch,
    urls: _config.repository.urls,
    config,
  });

  const _onOpenValidation = useCallback((filename, content, url) => {

    if (filename.startsWith("en")) {
      window.alert("tC Create cannot continue to open this file because it is in an outdated format. Please contact your administrator to update the repository's files to the latest format.")
      setCriticalValidationErrors(["tC Create cannot continue to open this file because it is in an outdated format. Please contact your administrator to update the repository's files to the latest format."]);
    }
    const notices = onOpenValidation(filename, content, url);

    if (notices.length > 0) {
      setCriticalValidationErrors(notices);
    } else {
      setCriticalValidationErrors([]);
    }
    return notices;
  }, [setCriticalValidationErrors]);

  // eslint-disable-next-line
  const _onLoadCache = useCallback(async ({ html_url, file }) => {
    // console.log("tcc // _onLoadCache", html_url, file);
    if (html_url) {
      let _cachedFile = await loadFileCache(html_url);

      if (_cachedFile && file) {
        setCachedFile(_cachedFile);
        // console.log("tcc // file", file, html_url);
        // console.log("tcc // cached file", _cachedFile);

        if (_cachedFile?.sha && file?.sha && _cachedFile?.sha !== file?.sha) {
          // Allow app to provide CACHED ("offline" content);
          // Might be different BRANCH (different user) or different FILE.
          // Might be STALE (sha has changed on DCS).
          // (NOTE: STALE cache would mean THIS user edited the same file in another browser.)

          const _cacheWarningMessage =
            'AutoSaved file: \n' + //_cachedFile.filepath + ".\n" +
            'Edited: ' + _cachedFile.timestamp?.toLocaleString() + '\n' +
            'Checksum: ' + _cachedFile.sha + '\n\n' +
            'Server file (newer): \n' + //file.name + ".\n" +
            'Checksum: ' + file.sha + '\n\n';

          setCacheFileKey(html_url);
          setCacheWarningMessage(_cacheWarningMessage);
        }
      };

      return _cachedFile;
    }
  }, [setCacheFileKey, setCacheWarningMessage, setCachedFile]);

  // eslint-disable-next-line
  const _onSaveCache = useCallback(({ file, content }) => {
    // console.log("tcc // _onSaveCache", file, content);
    if (file) {
      saveFileCache(file, content);
    }
  }, []);

  const onConfirmClose = () => {
    return isConfirmed(localString('ConfirmCloseWindow'));
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

  const { state: sourceFile } = sourceFileHook;

  const defaultContent = useDeepCompareMemo(() => {
    let _defaultContent;

    const filepathsExist = (!!filepath && !!sourceFile?.filepath)
    const filepathsMatch = (filepath === sourceFile?.filepath);
    const sourceFileIsReady = (filepathsExist && filepathsMatch);

    if (sourceFileIsReady) {
      const unfoldingWordOrganization = (sourceRepository?.id === targetRepository?.id);

      if (unfoldingWordOrganization) { // uW Content creators use same organization and source/target repos
        _defaultContent = sourceFile?.content;
      } else { // non-uW translators use repo under another organization
        _defaultContent = sourceFile?.publishedContent;
      };
    };

    return _defaultContent;
  }, [filepath, sourceFile, sourceRepository, targetRepository]);

  const readyForTargetFile = !!defaultContent;

  const targetFileHook = useFile({
    config,
    authentication,
    repository: targetRepository,
    filepath: (readyForTargetFile ? filepath : undefined),
    onFilepath: setFilepath,
    defaultContent,
    onOpenValidation: _onOpenValidation,
    // Disable autosave based on discussion in https://github.com/unfoldingWord/tc-create-app/issues/1417
    // onLoadCache: _onLoadCache,
    // onSaveCache: _onSaveCache,
  });

  useDeepCompareEffect(() => {
    if (cachedFile && targetFileHook?.state?.html_url !== cachedFile?.html_url) {
      clearCachedFile();
    };
  }, [cachedFile, targetFileHook, clearCachedFile]);

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

  return {
    authenticationHook,
    organizationHook,
    sourceRepositoryHook,
    targetRepositoryHook,
    sourceFileHook,
    targetFileHook,
  };
};

useGiteaReactToolkit.propTypes = {
  state: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};
