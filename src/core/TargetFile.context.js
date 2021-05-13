import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useFile, FileContext } from 'gitea-react-toolkit';
import { AppContext } from '../App.context';
import { fetchCatalogContent } from './dcsCatalogNextApis';

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

  console.log("--TargetFileContextProvider--");
  const appContext = useContext(AppContext);
  const sourceContext = useContext(FileContext);
  console.log("app context:", appContext);
  console.log("source file context:", sourceContext);
  console.log("target repository:",targetRepository);
  console.log("filepath:", filepath);
  //console.log("defaultContent:", defaultContent);
  let _defaultContent = sourceFile && sourceFile.content;
  if ( appContext.state.sourceRepository.id === appContext.state.targetRepository.id ) {
    // Boom! this is an editor not a translator
    // NOTE: at present the source info is *always* unfoldingword.
    // So when source and target are the same, then nothing to do
    // since the default content should come from the master branch
    // as it always has.
    console.log("Target is an edit case");
  } else {
    // Whoa! this is a translator. In this case, the default content
    // should come from the uW prod release.
    // let pull out the info we need
    const prodTag = appContext.state.sourceRepository.catalog.prod.branch_or_tag_name;
    console.log("Target is a translate case, use prod release:", prodTag);
    const getData = (async () => {
      let data = await fetchCatalogContent(
        'unfoldingword',
        appContext.state.sourceRepository.name,
        prodTag,
        filepath,
      )
      return data;
    });
    _defaultContent = getData();
    console.log("prodTag content:", _defaultContent);
  }

  const {
    state, actions, component, components, config,
  } = useFile({
    config: (authentication && authentication.config),
    authentication,
    repository: targetRepository,
    filepath,
    onFilepath: setFilepath,
    defaultContent: _defaultContent,
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
