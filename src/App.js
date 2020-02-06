import React, { useContext } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Headroom from 'react-headroom';
import { ApplicationBar } from 'gitea-react-toolkit';
import DrawerMenu from './components/drawer-menu/DrawerMenu';
import Workspace from './Workspace';

import theme from './theme';

import { AppContext, AppContextProvider } from './App.context';

const { version } = require('../package.json');
const title = `translationCore Create v${version}`

function AppComponent() {
  const {state, actions} = useContext(AppContext);
  const {
    authentication,
    sourceRepository,
    sourceBlob,
    fontScale,
    config,
  } = state;
  const {
    setAuthentication,
    setSourceRepository,
    setSourceBlob,
  } = actions;

  const drawerMenu = <DrawerMenu />;

  const style = {
    app: { fontSize: `${fontScale/100}em` },
    headroom: { zIndex: '200' },
    workspace: { margin: `${theme.spacing(2)}px` },
  };

  const applicationBar = (
    <Headroom style={style.headroom}>
      <ApplicationBar
        title={title}
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
  );

  return (
    <div className="App" style={style.app}>
      <MuiThemeProvider theme={theme}>
        <header id="App-header">
          {applicationBar}
        </header>
        <div style={style.workspace}>
          <Workspace />
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
