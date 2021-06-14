import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useFile, FileContext } from 'gitea-react-toolkit';
import { AppContext } from '../App.context';
import { loadState } from '../core/persistence';

const TargetFileContext = React.createContext();

function TargetFileContextProvider({
  onOpenValidation, children
}) {
  const {
    state: {
      authentication, targetRepository, filepath, setFilepath,
    } = {},
  } = useContext(AppContext);

  const { state: sourceFile } = useContext(FileContext);

  const targetFileCachedContent = loadState('content');
  console.log("cachedContent");
  console.log({c: targetFileCachedContent});
  
  console.log("defaultContent");
  console.log({c: (sourceFile && sourceFile.content)});

  const {
    state, actions, component, components, config,
  } = useFile({
    config: (authentication && authentication.config),
    authentication,
    repository: targetRepository,
    filepath,
    onFilepath: setFilepath,
    loadDefaultCachedContent: ()=> loadState('content'),
    defaultContent: (sourceFile && sourceFile.content),
    onOpenValidation: onOpenValidation,
  });

  const context = {
    state: { ...state }, 
    actions: { ...actions }, 
    component,
    components,
    config,
  };

  return (
    <TargetFileContext.Provider value={context}>
      {children}
    </TargetFileContext.Provider>
  );
};

TargetFileContextProvider.propTypes = {
  /** Children to render inside of Provider */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export {
  TargetFileContextProvider,
  TargetFileContext,
};
