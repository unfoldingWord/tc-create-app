import { useState, useEffect,useCallback } from 'react';
import { useLanguages } from 'uw-languages-rcl';
import { getLanguage } from '../components/languages/helpers';
import { loadAuthentication } from '../core/persistence';
import useOrgApi from './api/useOrgApi';
import useRepoApi from './api/useRepoApi';


export default function usePermalinksState({ permalink }) {

  const [isLoadingOrg, setLoadingOrg] = useState(true);
  const [isLoadingSourceRepo, setLoadingSourceRepo] = useState(true);
  const [isLoadingLanguages, setLoadingLanguages] = useState(true);
  const [isLoadingAuth, setLoadingAuthentication] = useState(true);

  const [permalinkState, setPermalinkState] = useState();
  const { state: languages } = useLanguages();
  const orgClient = useOrgApi();
  const repoClient = useRepoApi();

  const { org, lang, resource, pathToFile } = permalink || {};

  const getPermalinkState = useCallback(async () => {
   
    if (!languages?.length || !orgClient || !repoClient) return;

    setLoadingLanguages(false);
    console.log('Loading app from permalink...');
    
    const authentication = await loadAuthentication('authentication').finally(() => setLoadingAuthentication(false));

    const organization = await orgClient.orgGet(org)
      .then(({ data }) => data)
      .catch(err => {
        alert(`Could not find "${org}" organization provided in link.`);
        console.error(err);
      }).finally(() => setLoadingOrg(false));
    
    const language = getLanguage({ languageId: lang, languagesJSON: languages });

    if (!language) {
      alert(`Language "${lang}" was not found.`);
    }

    const sourceRepoName = 'en_' + resource;
    const sourceRepository = await repoClient.repoGet('unfoldingWord', sourceRepoName)
      .then(({ data }) => {
        data.tree_url = `api/v1/repos/unfoldingWord/${sourceRepoName}/git/trees/master`;
        return data;
      })
      .catch(err => {
        alert(`Could not find the resource "${lang}_${resource}" provided in link in "${org}" organization.`);
        console.error(err);
      }).finally(() => setLoadingSourceRepo(false));
    
    const filepath = pathToFile;
    
    const _permalinkState = {
      authentication,
      language,
      sourceRepository,
      filepath,
      organization,
      resourceLinks: null,
    };
    setPermalinkState(_permalinkState);
  }, [languages, orgClient, repoClient, org, lang, resource, pathToFile]);

  useEffect(() => {
    if(permalink && !permalinkState)
      getPermalinkState();
  },[getPermalinkState, permalink, permalinkState])

  if (!permalink) {
    console.log('Could not load app from permalink...');
    return {isLoading:false}
  };

  return { permalinkState, isLoading: !permalinkState && (isLoadingLanguages || isLoadingOrg || isLoadingSourceRepo || isLoadingAuth)}
}