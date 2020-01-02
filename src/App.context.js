import React, { useEffect, useCallback } from 'react';

import FilePopulator from './components/FilePopulator';
import { loadState } from './core/persistence';
import { useStateReducer } from './core/useStateReducer';

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
    targetFile,
    sourceFilePopulator,
    targetFilePopulator,
  } = state;

  const {
    setLanguage,
    setSourceRepository,
    setSourceBlob,
    setTargetBlob,
    setSourceFile,
    setTargetFile,
    setSourceFilePopulator,
    setTargetFilePopulator,
    setTargetRepoFromSourceRepo,
  } = actions;

  useEffect(() => {
    if (authentication && sourceRepository)
      setTargetRepoFromSourceRepo({ authentication, sourceRepository, language });
  }, [setTargetRepoFromSourceRepo, authentication, sourceRepository, language]);

  useEffect(() => {
    console.log('loadState("language")');
    loadState('language').then(setLanguage);
  }, [setLanguage]);

  useEffect(() => {
    console.log('loadState("sourceRepository")');
    loadState('sourceRepository').then(repo => {
      if (repo) repo.close = setSourceRepository;
      setSourceRepository(repo);
    });
  }, [setSourceRepository]);

  useEffect(() => {
    console.log('loadState("sourceBlob")');
    if (authentication && sourceRepository)
      loadState('sourceBlob').then(setSourceBlob);
  }, [authentication, sourceRepository, setSourceBlob]);

  const filePopulator = useCallback(({ repository, blob, onFile, type }) => {
    let _filePopulator;
    if (authentication && repository && blob) {
      let fileConfig;
      if (type === 'target' && sourceFile) {
        const { filepath, content } = sourceFile;
        fileConfig = { filepath, defaultContent: content, ...authentication.config };
      }
      const repoString = JSON.stringify(repository);
      const blobString = JSON.stringify(blob);
      _filePopulator = (
        <FilePopulator
          key={repoString + blobString}
          authentication={authentication}
          repository={repository}
          blob={blob}
          onFile={onFile}
          fileConfig={fileConfig}
        />
      );
    }
    return _filePopulator;
  }, [authentication, sourceFile]);

  // populate sourceFile when blob is updated
  useEffect(() => {
    const newFile = !sourceFile || (sourceBlob && sourceBlob.filepath !== sourceFile.filepath);
    if (newFile && sourceRepository && sourceBlob) {
      const _sourceFilePopulator = filePopulator({
        repository: sourceRepository,
        blob: sourceBlob,
        onFile: setSourceFile,
        type: 'source',
      });
      setSourceFilePopulator(_sourceFilePopulator);
      console.log('sourceFilePopulator', (sourceBlob ? sourceBlob.filepath : ''));
    }
  }, [sourceFile, setSourceFile, setSourceFilePopulator, filePopulator, sourceRepository, sourceBlob]);
  // populate targetFile when blob is updated
  useEffect(() => {
    const newFile = !targetFile || (targetBlob && targetBlob.filepath !== targetFile.filepath);
    const pathMatch = (sourceFile && targetBlob && sourceFile.filepath === targetBlob.filepath);
    if (targetRepository && newFile && pathMatch) {
      const _targetFilePopulator = filePopulator({
        repository: targetRepository,
        blob: targetBlob,
        onFile: setTargetFile,
        type: 'target',
      });
      setTargetFilePopulator(_targetFilePopulator);
      console.log('targetFilePopulator', (targetBlob ? targetBlob.filepath : ''));
    }
  }, [targetFile, setTargetFile, setTargetFilePopulator, filePopulator, sourceFile, targetRepository, targetBlob]);
  // populate targetBlob when sourceBlob is updated
  useEffect(() => {
    const newBlob = !targetBlob || (sourceBlob && sourceBlob.filepath !== targetBlob.filepath);
    if (newBlob) setTargetBlob(sourceBlob);
  }, [sourceBlob, targetBlob, setTargetBlob]);

  const value = {
    state,
    actions,
  };
  debugger;
  return (
    <AppContext.Provider value={value}>
      {sourceFilePopulator}
      {targetFilePopulator}
      {children}
    </AppContext.Provider>
  );
};
