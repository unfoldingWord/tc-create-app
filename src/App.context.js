import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { useStateReducer } from './hooks/useStateReducer';
import { useGiteaReactToolkit } from './hooks/useGiteaReactToolkit';
import { useWarning } from './hooks/useWarning';
import BranchMergerProvider from './components/branch-merger/context/BranchMergerProvider';

export const AppContext = React.createContext();

/**
 * Main application context provider that manages global state and integrates
 * various features including branch merging functionality.
 */
export function AppContextProvider({
  authentication,
  language,
  sourceRepository,
  filepath,
  organization,
  resourceLinks,
  contentIsDirty,
  children,
}) {
  const {
    state,
    actions,
  } = useStateReducer({
    authentication,
    language,
    sourceRepository,
    filepath,
    organization,
    resourceLinks,
    contentIsDirty,
  });

  const giteaReactToolkit = useGiteaReactToolkit({ state, actions });
  const warning = useWarning({ state, actions });

  const value = {
    state,
    actions,
    giteaReactToolkit,
    warning,
  };

  // Memoize branch merger params to prevent unnecessary re-renders
  const branchMergerParams = useMemo(() => {
    const params = {
      server: state.authentication?.config?.server,
      owner: state.targetRepository?.owner?.login,
      repo: state.targetRepository?.name,
      userBranch: state.targetRepository?.branch,
      tokenid: state.authentication?.token?.sha1,
      autoCheck: true,
      autoCheckInterval: 300000
    };

    // Validate required params
    const missingParams = Object.entries(params)
      .filter(([key, value]) => !value && key !== 'autoCheck' && key !== 'autoCheckInterval')
      .map(([key]) => key);

    if (missingParams.length > 0) {
      console.warn(
        `BranchMerger: Missing required parameters: ${missingParams.join(', ')}. ` +
        'Branch merger functionality will be disabled.'
      );
      return null;
    }

    return params;
  }, [
    state.authentication?.config?.server,
    state.targetRepository?.owner?.login,
    state.targetRepository?.name,
    state.targetRepository?.branch,
    state.authentication?.token?.sha1
  ]);

  return (
    <AppContext.Provider value={value}>
      <BranchMergerProvider {...branchMergerParams}>
        {children}
      </BranchMergerProvider>
    </AppContext.Provider>
  );
}

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
