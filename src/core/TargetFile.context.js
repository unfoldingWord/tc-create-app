import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  useFile,
} from 'gitea-react-toolkit';

import { AppContext } from '../App.context';

const TargetFileContext = React.createContext();

function TargetFileContextProvider({
  children,
}) {
  const {
    state: {
      authentication, targetRepository, sourceFile, targetFile,
    }={},
    actions: { setTargetFile },
  } = useContext(AppContext);

  const {
    state, actions, actions: { read }, component, components, config,
  } = useFile({
    config: (authentication && authentication.config),
    authentication,
    repository: targetRepository,
    filepath: (sourceFile && sourceFile.filepath),
    defaultContent: (sourceFile && sourceFile.content),
    file: targetFile,
    onFile: setTargetFile,
  });

  const sourceFilepath = sourceFile && sourceFile.filepath;
  const targetFilepath = targetFile && targetFile.filepath;
  useEffect(() => {
    const needTarget = (!!sourceFilepath && !targetFilepath);
    const oldTarget = (sourceFilepath !== targetFilepath);
    
    if (needTarget || oldTarget) read(sourceFilepath);
  }, [sourceFilepath, targetFilepath, read]);

  const context = {
    state,
    actions,
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
