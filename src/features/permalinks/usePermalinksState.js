import { useState, useEffect,useCallback } from 'react';
import { useLanguages } from 'uw-languages-rcl';
import { usePermalinks } from '@gwdevs/permalinks-hooks';
import useOrgApi from '../../hooks/api/useOrgApi';
import useRepoApi from '../../hooks/api/useRepoApi';

import { getLanguage } from '../../components/languages/helpers';
import routes from './routes.json';
import useStateKeys from './useStateKeys';

export default function usePermalinksState(loadedState) { 
  const { permalink, isLoading: isLoadingPermalink } = usePermalinks({ routes });
  const [permalinkState, setPermalinkState] = useState();

  const { state: languages } = useLanguages();
  const orgClient = useOrgApi();
  const repoClient = useRepoApi();
  
  const { keys: loadedKeys } = useStateKeys(loadedState);
  
  const getPermalinkState = useCallback(async () => {
   
    if (!languages?.length || !orgClient || !repoClient || !loadedState) return;
    
    console.log('Loading app from permalink...');
    
    const authentication = loadedState.authentication;

    const organization = loadedKeys.organization === permalink.organization
      ? loadedState.organization
      : permalink.organization && await orgClient.orgGet(permalink.organization).then(({ data }) => data).catch(err => console.warn(err))
      
    const language = loadedKeys.language === permalink.language
      ? loadedState.language
      : getLanguage({ languageId: permalink.language, languagesJSON: languages });

    if (!language) {
      alert(`Language "${permalink.language}" was not found.`);
    }

    const sourceRepoName = 'en_' + permalink.resource;
    const sourceRepository = loadedKeys.resource === permalink.resource
      ? loadedState.sourceRepository
      : permalink.resource && await repoClient.repoGet('unfoldingWord', sourceRepoName).then(({ data }) => {
        data.tree_url = `api/v1/repos/unfoldingWord/${sourceRepoName}/git/trees/master`;
        return data;
      }).catch(err => console.warn(err));
    
    const filepath = permalink.filepath;
    
    const _permalinkState = {
      authentication,
      language,
      sourceRepository,
      filepath,
      organization,
      resourceLinks: null,
    };
    setPermalinkState(_permalinkState);
    window.history.replaceState(_permalinkState,'');
  }, [languages, orgClient, repoClient, permalink, loadedKeys, loadedState]);

  useEffect(() => {

    if (isLoadingPermalink && !loadedState)
      return;
    
    if (permalink && !permalinkState)
      getPermalinkState();
    
    if (!permalink && !permalinkState)
      setPermalinkState(loadedState);
    
  }, [isLoadingPermalink, permalink, loadedState, permalinkState, getPermalinkState]);

  return { permalinkState, isLoading: isLoadingPermalink || (!!permalink && !permalinkState)}
}