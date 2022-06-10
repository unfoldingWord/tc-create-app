import {
  useState,
  useCallback
} from 'react';
import { loadState, saveState, loadAuthentication } from '../../core/persistence';
import routes from './routes.json';
import { useLanguages } from 'uw-languages-rcl';
import { usePermalinks } from '@gwdevs/permalinks-hooks';
import useOrgApi from '../../hooks/api/useOrgApi';
import useRepoApi from '../../hooks/api/useRepoApi';

import { getLanguage } from '../../components/languages/helpers';
import { useDeepCompareCallback, useDeepCompareEffect } from 'use-deep-compare';

export default function useInitialState() {
  const [initialState, setInitialState] = useState();
  const { state: languages } = useLanguages();
  const { permalink, isLoading: isLoadingPermalink } = usePermalinks({ routes });

  const repoClient = useRepoApi();
  const orgClient = useOrgApi();

  const getLocalState = useCallback(async () => {
    const authentication = await loadAuthentication('authentication');
    const organization = await loadState('organization');
    const language = await loadState('language');
    const sourceRepository = await loadState('sourceRepository');
    const resourceLinks = await loadState('resourceLinks');
    const filepath = await loadState('filepath');
    return {
      authentication,
      language,
      sourceRepository,
      filepath,
      organization,
      resourceLinks,
    };
  },[]);

  const setState = useDeepCompareCallback(async () => {

    if (!permalink && isLoadingPermalink) return;

    if (!permalink && !isLoadingPermalink) {
      setInitialState(await getLocalState());
      return;
    }

    const localLanguage = await loadState('language');

    const fetchedLanguage = !!languages.length && getLanguage({ languageId: permalink.language, languagesJSON: languages });

    const language = localLanguage?.languageId === permalink?.language
      ? localLanguage
      : fetchedLanguage?.languageId && fetchedLanguage

    if (permalink?.language && !language && !languages.length) return;

    if(language?.languageId) saveState('language', language);

    const localState = await getLocalState();
    const authentication = localState.authentication;

    const organization = localState.organization?.username === permalink.organization
      ? localState.organization
      : permalink.organization && await orgClient.orgGet(permalink.organization).then(({ data }) => {
        saveState('organization', data);
        return data
      }).catch(err => console.warn(err))

    const sourceRepoName = 'en_' + permalink.resource;
    const sourceRepository = localState.sourceRepository?.full_name.split('/')[1].split('_')[1] === permalink.resource
      ? localState.sourceRepository
      : permalink.resource && await repoClient.repoGet('unfoldingWord', sourceRepoName).then(({ data }) => {
        data.tree_url = `api/v1/repos/unfoldingWord/${sourceRepoName}/git/trees/master`;
        saveState('sourceRepository', data);
        return data;
      }).catch(err => console.warn(err));
    
    const filepath = permalink.filepath;
    
    const permalinkState = {
      authentication,
      language,
      sourceRepository,
      filepath,
      organization,
      resourceLinks: null,
    };
    setInitialState(permalinkState);
    window.history.replaceState(permalinkState, '');

  }, [languages,permalink,isLoadingPermalink,repoClient,orgClient]);

  useDeepCompareEffect(() => {
    if (!initialState) setState();
  }, [setState, initialState]);

  return [initialState];
}
