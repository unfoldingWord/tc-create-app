import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useFile, FileContext } from 'gitea-react-toolkit';
import {useEffect} from 'react';
import { AppContext } from '../App.context';
import { onOpenValidation } from './onOpenValidations';

const TargetFileContext = React.createContext();

function TargetFileContextProvider({
  validated, onValidated, onCriticalErrors, children
}) {
  const {
    state: {
      authentication, targetRepository, filepath, setFilepath,
    } = {},
  } = useContext(AppContext);

  const { state: sourceFile } = useContext(FileContext);

  const fake_onopen_validator = (fileContent) => {
    console.log("fake_onopen_validator()- fileContent:", fileContent);
  }

  const {
    state, actions, component, components, config,
  } = useFile({
    config: (authentication && authentication.config),
    authentication,
    repository: targetRepository,
    filepath,
    onFilepath: setFilepath,
    defaultContent: (sourceFile && sourceFile.content),
    onOpenValidation: fake_onopen_validator,
  });


  useEffect(() => {
    if (state === undefined || state.content === undefined) {
      onValidated(false);
      //onCriticalErrors(['Validating...']);
    } else if (!validated) {
      let criticalNotices = [];
      criticalNotices = onOpenValidation({
        filename: state.name, 
        content: state.content, 
        url: state.html_url,
      });
  
      if (criticalNotices.length > 0) {
        onCriticalErrors(criticalNotices);
      } else {
        onValidated(true);
      }
    }
  }, [validated, onValidated, state, onCriticalErrors]);

  const context = {
    state: { ...state, validated }, // state true/false
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
