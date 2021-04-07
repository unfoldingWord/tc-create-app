import React, {
  useContext, useState, useCallback, useEffect,
} from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Headroom from 'react-headroom';
import {
  ApplicationBar,
  AuthenticationContextProvider,
  RepositoryContextProvider,
  FileContextProvider,
  OrganizationContextProvider,
} from 'gitea-react-toolkit';

import { DrawerMenu } from './components/';

import {
  loadState,
  loadAuthentication,
  saveAuthentication,
} from './core/persistence';

import Workspace from './Workspace';

import theme from './theme';

import { AppContext, AppContextProvider } from './App.context';
import { getCommitHash } from './utils';

const { version } = require('../package.json');
const commitHash = getCommitHash(); 
const title = `translationCore Create - v${version}`;

function AppComponent() {
  const { state, actions } = useContext(AppContext);
  const {
    authentication,
    sourceRepository,
    filepath,
    fontScale,
    config,
    organization,
  } = state;
  const {
    setAuthentication,
    setSourceRepository,
    setOrganization,
    setFilepath,
  } = actions;

  const drawerMenu = <DrawerMenu commitHash={commitHash} />;
  
  const onHeadroomPin = () =>
  {
    const el = document.querySelector("#translatableComponent div div[role='toolbar']");
    if (el)
    {
      el.style.top = '64px';
    }
  }

  const onHeadroomUnfix = () =>
  {
    const el = document.querySelector("#translatableComponent div div[role='toolbar']");
    if (el)
    {
      el.style.top = '0px';
    }
  }

  const onHeadroomUnpin = () =>
  {
    const el = document.querySelector("#translatableComponent div div[role='toolbar']");
    if (el)
    {
      el.style.top = '0px';
    }
  }

  const style = {
    app: { fontSize: `${fontScale / 100}em` },
    headroom: { zIndex: '200' },
    workspace: { margin: `${theme.spacing(2)}px` },
  };
  return (
    <div className='App' style={style.app}>
      <MuiThemeProvider theme={theme}>
        <AuthenticationContextProvider
          authentication={authentication}
          onAuthentication={setAuthentication}
          config={config.authentication}
          saveAuthentication={saveAuthentication}
        >
          <OrganizationContextProvider
            authentication={authentication}
            organization={organization}
            onOrganization={setOrganization}
          >
            <RepositoryContextProvider
              authentication={authentication}
              repository={sourceRepository}
              onRepository={setSourceRepository}
              urls={config.repository.urls}
            >
              <FileContextProvider
                authentication={authentication}
                repository={sourceRepository}
                filepath={filepath}
                onFilepath={setFilepath}
              >
                <Headroom pinStart={64} style={style.headroom}
                  onPin={()=>{onHeadroomPin();}} onUnfix={()=>{onHeadroomUnfix();}} onUnpin={()=>{onHeadroomUnpin();}}
                >
                  <header id='App-header'>
                    <ApplicationBar
                      title={title}
                      build={commitHash}
                      // buttons={buttons}
                      drawerMenu={drawerMenu}
                    />
                  </header>
                </Headroom>
                <div id='Workspace-Container' style={style.workspace}>
                  <Workspace />
                </div>
              </FileContextProvider>
            </RepositoryContextProvider>
          </OrganizationContextProvider>
        </AuthenticationContextProvider>
      </MuiThemeProvider>
    </div>
  );
}

function App(props) {
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

  const _props = { ...props, ...resumedState };

  return !resumedState ? (
    <></>
  ) : (
    <AppContextProvider {..._props}>
      <AppComponent {...props} />
    </AppContextProvider>
  );
}

export default App;
