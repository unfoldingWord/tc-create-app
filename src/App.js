import React, { useContext } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Headroom from 'react-headroom';
import { ApplicationBar } from 'gitea-react-toolkit';
import DrawerMenu from './components/drawer-menu/DrawerMenu';
import Workspace from './Workspace';

import theme from './theme';

import { AppContext, AppContextProvider } from './App.context';

function AppComponent() {
  const {state, actions} = useContext(AppContext);
  const {
    authentication,
    sourceRepository,
    sourceBlob,
    sectionable,
    fontScale,
    config,
  } = state;
  const {
    setAuthentication,
    setSourceRepository,
    setSourceBlob,
    setSectionable,
    setFontScale,
  } = actions;

  const drawerMenu = (
    <DrawerMenu
      sectionable={sectionable}
      onSectionable={setSectionable}
      fontScale={fontScale}
      onFontScale={setFontScale}
    />
  );

  const style = {
    app: { fontSize: `${fontScale/100}em` },
    headroom: { zIndex: '200' },
    workspace: { margin: `${theme.spacing.unit * 2}px` },
  };
  return (
    <div className="App" style={style.app}>
      <MuiThemeProvider theme={theme}>
        <header id="App-header">
          <Headroom style={style.headroom}>
          <ApplicationBar
            title="GL Translate"
            // buttons={buttons}
            authentication={authentication}
            onAuthentication={setAuthentication}
            authenticationConfig={config.authenticationConfig}
            repository={sourceRepository}
            onRepository={setSourceRepository}
            repositoryConfig={config.repositoryConfig}
            blob={sourceBlob}
            onBlob={setSourceBlob}
            drawerMenu={drawerMenu}
          />
          </Headroom>
        </header>
        <div style={style.workspace}>
          <Workspace
            authenticationConfig={config.authenticationConfig}
            repositoryConfig={config.repositoryConfig}
          />
        </div>
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
