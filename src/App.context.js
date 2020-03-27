import React, { useEffect, useCallback } from 'react';

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
    setTargetRepoFromSourceRepo,
    resumeState,
  } = actions;

  console.log('AppContextProvider');

  const authMemo = authentication && JSON.stringify(authentication);

  useEffect(() => {
    if (authMemo && sourceRepository) {
      console.log('setTargetRepoFromSourceRepo');
      const _authentication = JSON.parse(authMemo);
      setTargetRepoFromSourceRepo({ authentication: _authentication, sourceRepository, language });
    }
  }, [authMemo, sourceRepository, language]);

  const _resumeState = useCallback(async () => {
    console.log('loadState');
    const _language = await loadState('language');
    const _sourceRepository = await loadState('sourceRepository');
    const _filepath = await loadState('filepath');
    await resumeState({ language: _language, sourceRepository: _sourceRepository, filepath: _filepath });
  }, [resumeState]);

  useEffect(() => {
    _resumeState();
  }, [_resumeState]);

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
