import React from 'react';
import PropTypes from 'prop-types';

import { useStateReducer } from './hooks/useStateReducer';
import { useGiteaReactToolkit } from './hooks/useGiteaReactToolkit';
import { useWarning } from './hooks/useWarning';
import BranchMergerProvider from './components/branch-merger/context/BranchMergerProvider';

export const AppContext = React.createContext();

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
  const warning = useWarning({ state, actions })

  const value = {
    state,
    actions,
    giteaReactToolkit,
    warning,
  };

  const params = {
    server: state.authentication?.config?.server,
    owner: state.targetRepository?.owner?.login,
    repo: state.targetRepository?.name,
    userBranch: state.targetRepository?.branch,
    tokenid: state.authentication?.token?.sha1,
  }

  return (
    <AppContext.Provider value={value}>
      <BranchMergerProvider {...params}>
        {children}
      </BranchMergerProvider>
    </AppContext.Provider>
  );
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
