import {
  useState,
  useCallback
} from 'react';
import { loadState, saveState, loadAuthentication } from '../../core/persistence';
import routes from './routes.json';
import { useLanguages } from 'uw-languages-rcl';
import { usePermalinks } from '@gwdevs/permalinks-hooks';
import { getUser, readRepo } from "gitea-react-toolkit";
import { getLanguage } from '../../components/languages/helpers';
import { useDeepCompareCallback, useDeepCompareEffect } from 'use-deep-compare';

export default function useInitialState() {
  const [initialState, setInitialState] = useState();
  const { state: languages } = useLanguages();
  const { permalink, isLoading: isLoadingPermalink } = usePermalinks({ routes });

  const getLocalState = useCallback(async (authenticated=false) => {
    const authentication = await loadAuthentication('authentication');
    const organization = (!authenticated || authentication) && await loadState('organization');
    const language = (!authenticated || authentication) && await loadState('language');
    const sourceRepository = (!authenticated || authentication) && await loadState('sourceRepository');
    const resourceLinks = (!authenticated || authentication) && await loadState('resourceLinks');
    const filepath = (!authenticated || authentication) && await loadState('filepath');
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
      setInitialState(await getLocalState(true));
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
      : permalink.organization && await getUser({username: permalink.organization}).then(({ data }) => {
        saveState('organization', data);
        return data
      }).catch(err => console.warn(err))

    const sourceRepoName = 'en_' + permalink.resource;
    const sourceRepository = localState.sourceRepository?.full_name.split('/')[1].split('_')[1] === permalink.resource
      ? localState.sourceRepository
      : permalink.resource && await readRepo({owner:'unfoldingWord', repo:sourceRepoName}).then(({ data }) => {
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
  }, [languages,permalink,isLoadingPermalink]);

  useDeepCompareEffect(() => {
    if (!initialState) setState();
  }, [setState, initialState]);

  return [initialState];
}
