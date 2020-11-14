import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useFile, FileContext } from 'gitea-react-toolkit';
import useEffect from 'use-deep-compare-effect';
import { AppContext } from '../App.context';
//import ValidateOnOpenDialog from './ValidateOnOpenDialog';
import * as cv from 'uw-content-validation';

const TargetFileContext = React.createContext();

function TargetFileContextProvider({ 
  validated, onValidated, onCriticalErrors, children 
}) {
  const {
    state: {
      authentication, targetRepository, filepath, setFilepath,
    }={},
  } = useContext(AppContext);
  
  const { state: sourceFile } = useContext(FileContext);

  const {
    state, actions, component, components, config,
  } = useFile({
    config: (authentication && authentication.config),
    authentication,
    repository: targetRepository,
    filepath,
    onFilepath: setFilepath,
    defaultContent: (sourceFile && sourceFile.content),
  });

  const validate = async (langId, bookID, content) => {
    return await cv.checkTN_TSVText(langId, bookID, 'dummy', content, '',
      {checkLinkedTAArticleFlag: false, checkLinkedTWArticleFlag: false}
    );
  }

  useEffect( () => {
    console.log("useEffect() validated, state.content=", validated, state?.content ? "has content": "no content");
    if ( state?.content === undefined ) {
      onValidated(false);
      onCriticalErrors(['Validating...']);
    } else if ( !validated ) {
      const _name  = state.name.split('_');
      const langId = _name[0];
      const bookID = _name[2]?.split('-')[1]?.split('.')[0];
      validate(langId, bookID, state.content).then(
        (value) => {
          let criticalNotices = [];
          for ( let i=0; i<value.noticeList.length; i++ ) {
            let notice = value.noticeList[i];
            if ( notice.priority >= 700 ) {
              let msg = `On line ${notice.lineNumber}, ${notice.message}.`;
              if ( notice.fieldName !== undefined ) msg = msg + '\n    ' + notice.fieldName;
              if ( notice.details !== undefined ) msg = msg + ' ' + notice.details;
              if ( notice.rowID !== undefined ) msg = msg + ' with row id=' + notice.rowID;
              criticalNotices.push(msg);
            }
          }
          if ( criticalNotices.length > 0 ) {
            onCriticalErrors(criticalNotices);
          } else {
            onValidated(true);
          }
        },
        (value) => {
          console.log("[TargetFile.context.js] rejected promise in validate on open");
        }
      );
    }
    }, [validated, onValidated, state, onCriticalErrors]);   

  const context = {
    state: {...state, validated}, // state true/false
    actions: {...actions, validate}, // add my action
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
