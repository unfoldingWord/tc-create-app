import React, { useEffect } from 'react';

// import { loadState } from './core/persistence';
import { useStateReducer } from './core/useStateReducer';

export const AppContext = React.createContext();

export function AppContextProvider({
  authentication: __authentication,
  language: __language,
  sourceRepository: __sourceRepository,
  filepath: __filepath,
  organization: __organization,
  children,
}) {
  const [state, actions] = useStateReducer({
    authentication: __authentication,
    language: __language,
    sourceRepository: __sourceRepository,
    filepath: __filepath,
    organization: __organization,
  });

  const {
    authentication,
    language,
    sourceRepository,
    organization
  } = state;

  const {
    setTargetRepoFromSourceRepo,
    // resumeState,
  } = actions;

  const authMemo = authentication && JSON.stringify(authentication);

  useEffect(() => {
    if (authMemo && sourceRepository && organization) {
      const _authentication = JSON.parse(authMemo);
      setTargetRepoFromSourceRepo({ authentication: _authentication, sourceRepository, language, organization });
    }
  }, [authMemo, sourceRepository, language, setTargetRepoFromSourceRepo, organization]);

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
