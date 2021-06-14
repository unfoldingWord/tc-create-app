import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useFile, FileContext } from 'gitea-react-toolkit';
import { AppContext } from '../App.context';
import { loadCacheTargetFile } from '../core/persistence';

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

  const targetFileCachedContentFile = loadCacheTargetFile();
  console.log("cachedContent");
  console.log(targetFileCachedContentFile);
  
  console.log("defaultContent");
  console.log(sourceFile);

  const {
    state, actions, component, components, config,
  } = useFile({
    config: (authentication && authentication.config),
    authentication,
    repository: targetRepository,
    filepath,
    onFilepath: setFilepath,
    loadDefaultCachedContentFile: ()=> loadCacheTargetFile(),
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
