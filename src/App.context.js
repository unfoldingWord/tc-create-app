import React, { useEffect } from 'react';

// import { loadState } from './core/persistence';
import { useStateReducer } from './core/useStateReducer';

export const AppContext = React.createContext();

export function AppContextProvider({
  authentication: __authentication,
  language: __language,
  sourceRepository: __sourceRepository,
  filepath: __filepath,
  children,
}) {
  const [state, actions] = useStateReducer({
    authentication: __authentication,
    language: __language,
    sourceRepository: __sourceRepository,
    filepath: __filepath,
  });

  const {
    authentication,
    language,
    sourceRepository,
  } = state;

  const {
    setTargetRepoFromSourceRepo,
    // resumeState,
  } = actions;

  console.log('AppContextProvider');

  const authMemo = authentication && JSON.stringify(authentication);

  useEffect(() => {
    if (authMemo && sourceRepository) {
      console.log('setTargetRepoFromSourceRepo');
      const _authentication = JSON.parse(authMemo);
      setTargetRepoFromSourceRepo({ authentication: _authentication, sourceRepository, language });
    }
  }, [authMemo, sourceRepository, language, setTargetRepoFromSourceRepo]);

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
