import React, {
  useState,
  useCallback,
  useEffect,
} from 'react';

import { loadState, loadAuthentication } from './core/persistence';

import ConfirmContextProvider from './context/ConfirmContextProvider';
import { AppContextProvider } from './App.context';
import Layout from './Layout';
import { SnackbarProviderWrapper } from './contexts/SnackbarContext';

export default function App() {
  const [resumedState, setResumedState] = useState();

  const resumeState = useCallback(async () => {
    // note that the authentication context manages its own
    // state via provided persistence load and save closures
    const authentication = await loadAuthentication('authentication');

    const organization = authentication && (await loadState('organization'));
    const language = authentication && (await loadState('language'));
    const sourceRepository =
      authentication && (await loadState('sourceRepository'));
    const resourceLinks = authentication && (await loadState('resourceLinks'));
    const filepath = authentication && (await loadState('filepath'));
    const _resumedState = {
      authentication,
      language,
      sourceRepository,
      filepath,
      organization,
      resourceLinks,
    };
    setResumedState(_resumedState);
  }, []);

  useEffect(() => {
    resumeState();
  }, [resumeState]);

  const props = { ...resumedState };

  return !resumedState ? (
    <></>
  ) : (
    <SnackbarProviderWrapper>
      <ConfirmContextProvider>
        <AppContextProvider {...props}>
          <Layout />
        </AppContextProvider>
      </ConfirmContextProvider>
    </SnackbarProviderWrapper>
  );
};
