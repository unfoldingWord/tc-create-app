import React from 'react';
import PropTypes from 'prop-types';

import { useStateReducer } from './core/useStateReducer';

import { useGiteaReactToolkit } from './hooks/useGiteaReactToolkit';

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

  const value = {
    state,
    actions,
    giteaReactToolkit,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
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
