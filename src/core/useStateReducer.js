import { useCallback, useReducer } from 'react';
import {ensureRepo} from 'gitea-react-toolkit';

import {stateReducer} from './state.reducer';
import {saveState} from './persistence';
import defaults from './state.defaults';

export const useStateReducer = () => {
  const [state, dispatch] = useReducer(stateReducer, defaults);

  const setSectionable = useCallback((value) => {
    dispatch({type: 'set_sectionable', value});
  },[]);

  const setFontScale = useCallback((value) => {
    dispatch({type: 'set_font_scale', value});
  },[]);

  const setConfig = useCallback((value) => {
    dispatch({type: 'set_config', value});
  },[]);

  const setTargetRepository = useCallback((value) => {
    dispatch({type: 'set_target_repository', value});
  },[]);

  const setSourceRepository = useCallback((value) => {
    dispatch({type: 'set_source_repository', value});
    saveState('sourceRepository', value);
    if (!value) setTargetRepository();
  },[setTargetRepository]);

  const setTargetFile = useCallback((value) => {
    dispatch({type: 'set_target_file', value});
  },[]);

  const setSourceFile = useCallback((value) => {
    dispatch({type: 'set_source_file', value});
    if (!value) setTargetFile();
  },[setTargetFile]);

  const setSourceBlob = useCallback((value) => {
    dispatch({type: 'set_source_blob', value});
    saveState('sourceBlob', value);
    dispatch({type: 'set_target_blob', value}); // populate targetBlob when sourceBlob is updated
    if (!value) setSourceFile();
    if (!value) setTargetFile();
  },[setSourceFile, setTargetFile]);

  const setTargetFilePopulator = useCallback((value) => {
    dispatch({type: 'set_target_file_populator', value});
  },[]);

  const setSourceFilePopulator = useCallback((value) => {
    dispatch({type: 'set_source_file_populator', value});
    if (!value) setTargetFilePopulator();
  },[setTargetFilePopulator]);

  const setTargetRepoFromSourceRepo = useCallback(({authentication, sourceRepository, language}) => {
    if (authentication && sourceRepository && language) {
      const repositoryNameArray = sourceRepository.name.split('_');
      const resourceNameArray = repositoryNameArray.slice(1);
      const translationRepoName = `${language.languageId}_${resourceNameArray.join('_')}`;
      const {description} = sourceRepository;
      const params = {
        owner: authentication.user.username,
        repo: translationRepoName,
        config: authentication.config,
        settings: {description},
      };
      ensureRepo(params).then((_targetRepository) => {
        setTargetRepository(_targetRepository);
      });
    } else {
      setTargetRepository();
    }
  },[setTargetRepository]);

  const setAuthentication = useCallback((value) => {
    dispatch({type: 'set_authentication', value});
    if (!value) setSourceRepository();
  },[setSourceRepository]);

  const setLanguage = useCallback((value) => {
    dispatch({type: 'set_language', value});
    saveState('language', value);
    if (!value) setSourceRepository();
  },[setSourceRepository]);

  const actions = {
    setAuthentication,
    setLanguage,
    setSectionable,
    setFontScale,
    setConfig,
    setSourceRepository,
    setTargetRepository,
    setSourceFile,
    setSourceBlob,
    setTargetFile,
    setSourceFilePopulator,
    setTargetFilePopulator,
    setTargetRepoFromSourceRepo,
  };
  return [state, actions];
};