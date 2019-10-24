import React, { useEffect, useCallback } from 'react';

import FilePopulator from './components/FilePopulator';
import {loadState} from './core/persistence';
import {useStateReducer} from './core/useStateReducer';

export const AppContext = React.createContext();

export function AppContextProvider({
  children,
}) {
  const [state, actions] = useStateReducer();
  const {
    authentication,
    language,
    sourceRepository,
    targetRepository,
    sourceBlob,
    targetBlob,
    sourceFile,
    sourceFilePopulator,
    targetFilePopulator,
  } = state;

  const {
    setLanguage,
    setSourceRepository,
    setSourceFile,
    setSourceBlob,
    setTargetFile,
    setSourceFilePopulator,
    setTargetFilePopulator,
    setTargetRepoFromSourceRepo,
  } = actions;

  useEffect(() => {
    setTargetRepoFromSourceRepo({authentication, sourceRepository, language});
  }, [setTargetRepoFromSourceRepo, authentication, sourceRepository, language]);

  useEffect(() => {
    loadState('language').then(setLanguage);
  }, [setLanguage]);

  useEffect(() => {
    loadState('sourceRepository').then(repo => {
      if (repo) repo.close = setSourceRepository;
      setSourceRepository(repo);
    });
  }, [setSourceRepository]);

  useEffect(() => {
    loadState('sourceBlob').then(setSourceBlob);
  }, [setSourceBlob]);

  const filePopulator = useCallback(({repository, blob, onFile, authentication, sourceFile}) => {
    let _filePopulator;
    if (repository && blob) {
      let fileConfig;
      if (sourceFile) {
        const {filepath, content} = sourceFile;
        fileConfig = {filepath, defaultContent: content, ...authentication.config};
      }
      _filePopulator = (
        <FilePopulator
          key={Math.random()}
          authentication={authentication}
          repository={repository}
          blob={blob}
          onFile={onFile}
          fileConfig={fileConfig}
        />
      );
    }
    return _filePopulator;
  }, []);

  // populate sourceFile when blob is updated
  useEffect(()=> {
    const _sourceFilePopulator = filePopulator({
      authentication,
      repository: sourceRepository,
      blob: sourceBlob,
      onFile: setSourceFile,
    });
    setSourceFilePopulator(_sourceFilePopulator);
  }, [setSourceFile, setSourceFilePopulator, filePopulator, authentication, sourceRepository, sourceBlob]);
  // populate targetFile when blob is updated
  useEffect(()=> {
    if (sourceFile) {
      const _targetFilePopulator = filePopulator({
        authentication,
        repository: targetRepository,
        blob: targetBlob,
        onFile: setTargetFile,
        sourceFile,
      });
      setTargetFilePopulator(_targetFilePopulator);
    }
  }, [setTargetFile, setTargetFilePopulator, filePopulator, authentication, sourceFile, targetRepository, targetBlob]);

  const value = {
    state,
    actions,
  };

  return (
    <AppContext.Provider value={value}>
      {sourceFilePopulator}
      {targetFilePopulator}
      {children}
    </AppContext.Provider>
  );
};
