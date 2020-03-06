import { useCallback, useReducer } from 'react';
import {ensureRepo} from 'gitea-react-toolkit';

import {stateReducer} from './state.reducer';
import {saveState} from './persistence';
import defaults from './state.defaults';

export const useStateReducer = () => {
  const [state, dispatch] = useReducer(stateReducer, defaults);

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
    if (!value) dispatch({type: 'set_target_repository'});
  },[]);

  const setTargetFile = useCallback((value) => {
    dispatch({type: 'set_target_file', value});
  },[]);

  const setSourceFile = useCallback((value) => {
    dispatch({type: 'set_source_file', value});
  },[]);

  const setSourceBlob = useCallback((value) => {
    dispatch({type: 'set_source_blob', value});
    saveState('sourceBlob', value);
    if (!value) dispatch({type: 'set_source_file'});
  },[]);

  const setTargetBlob = useCallback((value) => {
    dispatch({type: 'set_target_blob', value});
    if (!value) dispatch({type: 'set_target_file'});
  },[]);

  const setSourceFilePopulator = useCallback((value) => {
    dispatch({type: 'set_source_file_populator', value});
    if (!value) dispatch({type: 'set_target_file_populator'});
  },[]);

  const setTargetFilePopulator = useCallback((value) => {
    dispatch({type: 'set_target_file_populator', value});
  },[]);

  const setTargetRepoFromSourceRepo = useCallback(({authentication, sourceRepository, language}) => {
    if (authentication && sourceRepository && language) {
      const repositoryNameArray = sourceRepository.name.split('_');
      const resourceNameArray = repositoryNameArray.slice(1);
      const translationRepoName = `${language.languageId}_${resourceNameArray.join('_')}`;
      const {description} = sourceRepository;
      const sourceRepoPush = sourceRepository.permissions.push;
      const sameRepositoryName = translationRepoName === sourceRepository.name;
      const editSource = (sourceRepoPush && sameRepositoryName);
      if (editSource) {
        setTargetRepository(sourceRepository);
      } else {
        const owner = authentication.user.username;
        const params = {
          owner,
          repo: translationRepoName,
          config: authentication.config,
          settings: {description},
        };
        ensureRepo(params).then((_targetRepository) => {
          setTargetRepository(_targetRepository);
        });
      }
    } else {
      setTargetRepository();
    }
  },[setTargetRepository]);

  const setAuthentication = useCallback((value) => {
    dispatch({type: 'set_authentication', value});
    if (!value && !!state.sourceRepository) setSourceRepository(); // reset if logged out
  },[setSourceRepository, state.sourceRepository]);

  const setLanguage = useCallback((value) => {
    dispatch({type: 'set_language', value});
    saveState('language', value);
    if (!value) setSourceRepository(); // reset if no language
  },[setSourceRepository]);

  const actions = {
    setAuthentication,
    setLanguage,
    setFontScale,
    setConfig,
    setSourceRepository,
    setTargetRepository,
    setSourceBlob,
    setTargetBlob,
    setSourceFile,
    setTargetFile,
    setSourceFilePopulator,
    setTargetFilePopulator,
    setTargetRepoFromSourceRepo,
  };
  return [state, actions];
};