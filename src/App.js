import React, { useContext } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Headroom from 'react-headroom';
import {
  ApplicationBar,
  AuthenticationContextProvider,
  RepositoryContextProvider,
  FileContextProvider,
} from 'gitea-react-toolkit';

import DrawerMenu from './components/drawer-menu/DrawerMenu';
import Workspace from './Workspace';

import theme from './theme';

import { AppContext, AppContextProvider } from './App.context';

const { version } = require('../package.json');
const title = `translationCore Create - v${version}`

function AppComponent() {
  const {state, actions} = useContext(AppContext);
  const {
    authentication,
    sourceRepository,
    sourceFile,
    fontScale,
    config,
  } = state;
  const {
    setAuthentication,
    setSourceRepository,
    setSourceFile,
  } = actions;

  const drawerMenu = <DrawerMenu />;

  const style = {
    app: { fontSize: `${fontScale/100}em` },
    headroom: { zIndex: '200' },
    workspace: { margin: `${theme.spacing(2)}px` },
  };

  return (
    <div className="App" style={style.app}>
      <MuiThemeProvider theme={theme}>
        <AuthenticationContextProvider
          authentication={authentication}
          onAuthentication={setAuthentication}
          config={config.authentication}
        >
          <RepositoryContextProvider
            repository={sourceRepository}
            onRepository={setSourceRepository}
            urls={config.repository.urls}
          >
            <FileContextProvider
              file={sourceFile}
              onFile={setSourceFile}
            >
              <header id="App-header">
                <Headroom style={style.headroom}>
                  <ApplicationBar
                    title={title}
                    // buttons={buttons}
                    drawerMenu={drawerMenu}
                  />
                </Headroom>
              </header>
              <div style={style.workspace}>
                <Workspace />
              </div>
            </FileContextProvider>
          </RepositoryContextProvider>
        </AuthenticationContextProvider>
      </MuiThemeProvider>
    </div>
  );
}

function App(props) {
  return (
    <AppContextProvider {...props}>
      <AppComponent {...props} />
    </AppContextProvider>
  );
}

export default App;
