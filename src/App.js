import React from 'react';
import ConfirmContextProvider from './context/ConfirmContextProvider';
import { AppContextProvider } from './App.context';
import Layout from './Layout';
import useInitialState from './features/permalinks/useInitialState';
import PermalinksHandler from './features/permalinks/PermalinksHandler';

export default function App() {
  const [initialState] = useInitialState();
  const props = { ...initialState };
  return !initialState
    ? (
      <></>
    )
    : (
        <ConfirmContextProvider>
          <AppContextProvider {...props}>
            <PermalinksHandler intialState={initialState}>
              <Layout />
            </PermalinksHandler>
          </AppContextProvider>
        </ConfirmContextProvider>
    );
};
