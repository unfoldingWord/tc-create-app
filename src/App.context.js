import React, { useEffect } from 'react';

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
  } = state;

  const {
    setLanguage,
    setSourceRepository,
    setTargetRepoFromSourceRepo,
    setSourceFile,
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
    loadState('sourceRepository').then(setSourceRepository);
  }, [setSourceRepository]);

  useEffect(() => {
    console.log('loadState("sourceFile")');
    loadState('sourceFile').then(setSourceFile);
  }, [setSourceFile]);

  const value = {
    state,
    actions,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
