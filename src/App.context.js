import React from 'react';
import PropTypes from 'prop-types';

import { useLanguages } from 'uw-languages-rcl';
import { useStateReducer } from './core/useStateReducer';

import { useGiteaReactToolkit } from './hooks/useGiteaReactToolkit';

export const AppContext = React.createContext();

export function AppContextProvider({
  authentication: _authentication,
  language: _language,
  sourceRepository: _sourceRepository,
  filepath: _filepath,
  organization: _organization,
  resourceLinks: _resourceLinks,
  contentIsDirty: _contentIsDirty,
  children,
}) {
  const {
    state,
    actions,
  } = useStateReducer({
    authentication: _authentication,
    language: _language,
    sourceRepository: _sourceRepository,
    filepath: _filepath,
    organization: _organization,
    resourceLinks: _resourceLinks,
    contentIsDirty: _contentIsDirty,
  });
  // uw-languages-rcl
  const { state: languages } = useLanguages();
  const giteaReactToolkit = useGiteaReactToolkit({ state, actions });

  const value = {
    state: {
      ...state,
      languages,
    },
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
