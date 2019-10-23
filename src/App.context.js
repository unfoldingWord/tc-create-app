import React, { useState, useEffect, useCallback } from 'react';
import { ensureRepo } from 'gitea-react-toolkit';
import appPackage from '../package.json';

import FilePopulator from './components/FilePopulator';
import {saveState, loadState} from './core/persistence';

export const AppContext = React.createContext();

const server = 'https://bg.door43.org';

const defaults = {
  sectionable: true,
  fontScale: 100,
};

const config = {
  authenticationConfig: {
    server,
    tokenid: appPackage.name,
  },
  repositoryConfig: {
    server,
    urls: [
      'https://bg.door43.org/api/v1/repos/unfoldingword/en_ta',
      'https://bg.door43.org/api/v1/repos/unfoldingword/en_tw',
      'https://bg.door43.org/api/v1/repos/unfoldingword/en_tn',
      'https://bg.door43.org/api/v1/repos/unfoldingword/en_obs',
    ],
  },
};

export function AppContextProvider({
  children,
}) {
  const [sectionable, setSectionable] = useState(defaults.sectionable);
  const [fontScale, setFontScale] = useState(defaults.fontScale);
  const [authentication, setAuthentication] = useState();
  const [sourceRepository, setSourceRepository] = useState();
  const [targetRepository, setTargetRepository] = useState();
  const [sourceBlob, setSourceBlob] = useState();
  const [targetBlob, setTargetBlob] = useState();
  const [sourceFile, setSourceFile] = useState();
  const [targetFile, setTargetFile] = useState();
  const [language, setLanguage] = useState();
  const [sourceFilePopulator, setSourceFilePopulator] = useState();
  const [targetFilePopulator, setTargetFilePopulator] = useState();

  const cleanup = useCallback(async () => {
    await saveState('sourceBlob')
    await saveState('sourceRepository');
    setSourceBlob();
    setSourceRepository();
  }, []);

  useEffect(() => {
    if (language) saveState('language', language);
    else loadState('language').then(setLanguage);
  }, [language]);

  useEffect(() => {
    if (sourceRepository) {
      saveState('sourceRepository', sourceRepository);
    } else {
      loadState('sourceRepository').then(repo => {
        if (repo) {
          repo.close = cleanup;
          setSourceRepository(repo);
        } else {
          cleanup();
        }
      });
    }
  }, [sourceRepository, cleanup]);

  useEffect(() => {
    if (sourceBlob) saveState('sourceBlob', sourceBlob);
    else loadState('sourceBlob').then(setSourceBlob);
  }, [sourceBlob]); 

  // populate targetRepository when sourceRepository is updated
  useEffect(() => {
    if (authentication && sourceRepository && language) {
      const repositoryNameArray = sourceRepository.name.split('_');
      const resourceNameArray = repositoryNameArray.slice(1);
      const translationRepoName = `${language.languageId}_${resourceNameArray.join('_')}`;
      const {description} = sourceRepository;
      const params = {
        owner: authentication.user.username,
        repo: translationRepoName,
        config: authentication.config,
        settings: {description},
      };
      ensureRepo(params).then((_targetRepository) => {
        setTargetRepository(_targetRepository);
      });
    } else {
      setTargetRepository();
    }
  }, [authentication, sourceRepository, language]);
  // populate targetBlob when sourceBlob is updated
  useEffect(() => {
    setTargetBlob(sourceBlob);
  }, [sourceBlob]);
  // populate sourceFile when blob is updated
  useEffect(()=> {
    if (sourceRepository && sourceBlob) {
      const _sourceFilePopulator = (
        <FilePopulator
          key={Math.random()}
          authentication={authentication}
          repository={sourceRepository}
          blob={sourceBlob}
          file={sourceFile}
          onFile={setSourceFile}
        />
      );
      setSourceFilePopulator(_sourceFilePopulator);
    } else {
      setSourceFilePopulator();
    }
  }, [authentication, sourceRepository, sourceBlob, sourceFile]);
  // populate targetFile when blob is updated
  useEffect(()=> {
    if (sourceFile && targetRepository && targetBlob) {
      const fileConfig = {
        filepath: sourceFile.filepath,
        defaultContent: sourceFile.content,
        ...authentication.config
      };
      const _targetFilePopulator = (
        <FilePopulator
          key={Math.random()}
          authentication={authentication}
          repository={targetRepository}
          blob={targetBlob}
          file={targetFile}
          onFile={setTargetFile}
          fileConfig={fileConfig}
        />
      );
      setTargetFilePopulator(_targetFilePopulator);
    } else {
      setTargetFilePopulator();
    }
  }, [authentication, sourceFile, targetRepository, targetBlob, targetFile]);

  useEffect(() => {
    if (sourceFile && targetFile && targetRepository) {
      const autoInitFileContent = `# ${targetRepository.name}\n\n${targetRepository.description}`;
      const autoInitFile = targetFile.content.trim() === autoInitFileContent;
      if (autoInitFile) {
        const _targetFile = {...targetFile, content: sourceFile.content};
        setTargetFile(_targetFile);
      }
    } else {
      setTargetFile();
    }
  }, [targetRepository, sourceFile, targetFile]);

  const state = {
    authentication,
    sourceRepository,
    targetRepository,
    sourceBlob,
    targetBlob,
    sourceFile,
    targetFile,
    language,
    sectionable,
    fontScale,
    config,
  };

  const actions = {
    setAuthentication,
    setSourceRepository,
    setTargetRepository,
    setSourceBlob,
    setTargetBlob,
    setSourceFile,
    setTargetFile,
    setLanguage,
    setSectionable,
    setFontScale,
  };

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
