import React, { useEffect, 
  //useState //uw-languages-rcl
} from 'react';

// import { loadState } from './core/persistence';
import { useStateReducer } from './core/useStateReducer';
import useLanguages from 'uw-languages-rcl';

export const AppContext = React.createContext();

export function AppContextProvider({
  authentication: __authentication,
  language: __language,
  sourceRepository: __sourceRepository,
  filepath: __filepath,
  organization: __organization,
  children,
  resourceLinks: __resourceLinks,
}) {
  const [state, actions] = useStateReducer({
    authentication: __authentication,
    language: __language,
    sourceRepository: __sourceRepository,
    filepath: __filepath,
    organization: __organization,
    resourceLinks: __resourceLinks,
  });
  // uw-languages-rcl
  //const [languages, setLanguages] = useState("");
  const { state: languages } = useLanguages();

  const {
    authentication, language, sourceRepository, organization,
  } = state;

  const { setTargetRepoFromSourceRepo } = actions;

  const authMemo = authentication && JSON.stringify(authentication);

  useEffect(() => {
    if (authMemo && sourceRepository && organization) {
      const _authentication = JSON.parse(authMemo);

      setTargetRepoFromSourceRepo({
        authentication: _authentication,
        sourceRepository,
        language,
        organization,
      });
    }
  }, [
    authMemo,
    sourceRepository,
    language,
    setTargetRepoFromSourceRepo,
    organization,
  ]);

  /* uw-languages-rcl
  useEffect( () => {
    async function getLanguages() {
      const langs = (await fetch('https://td.unfoldingword.org/exports/langnames.json'))
      const _langs = await langs.json()
      setLanguages(_langs);
    }

    if (languages === "") {
      getLanguages();
    }
  }, [languages]
  );
  */

  const value = {
    state: {...state, languages},
    actions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
