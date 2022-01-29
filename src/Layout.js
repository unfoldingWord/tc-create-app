import React, { useContext } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Headroom from 'react-headroom';
import { ApplicationBar } from 'gitea-react-toolkit';

import { useBeforeunload } from 'react-beforeunload';
import { DrawerMenu } from './components/';

import Workspace from './Workspace';
import ConfirmDialog from './components/ConfirmDialog';

import theme from './theme';

import { AppContext } from './App.context';
import { getCommitHash } from './utils';
import { localString } from './core/localStrings';
import {
  onHeadroomPin,
  onHeadroomUnfix,
  onHeadroomUnpin,
} from './helpers';
import AutoSaveDialog from './components/dialogs/AutoSaveDialog';
import SourceValidationDialog from './components/dialogs/SourceValidationDialog';

const { version } = require('../package.json');
const commitHash = getCommitHash();
const title = `translationCore Create - v${version}`;

export default function Layout() {
  const {
    state: {
      fontScale,
      contentIsDirty,
      filepath,
      criticalValidationErrors=[],
      cacheWarningMessage,
    },
    auth,
    sourceRepo,
    sourceFile,
  } = useContext(AppContext);

  const drawerMenu = <DrawerMenu commitHash={commitHash} />;

  useBeforeunload((event) => {
    if (contentIsDirty) {
      event.preventDefault();
      event.returnValue = localString('ConfirmCloseWindow');
      return localString('ConfirmCloseWindow');
    }
  });

  const style = {
    app: { fontSize: `${fontScale / 100}em` },
    headroom: { zIndex: '200' },
    workspace: { margin: `${theme.spacing(2)}px` },
  };

  const validationDialog = <SourceValidationDialog />;

  let component = (
    <>
      <Headroom pinStart={64} style={style.headroom}
        onPin={onHeadroomPin}
        onUnfix={onHeadroomUnfix}
        onUnpin={onHeadroomUnpin}
      >
        <header id='App-header'>
          <ApplicationBar
            title={title}
            build={commitHash}
            // buttons={buttons}
            drawerMenu={drawerMenu}
            filepath={filepath}
            auth={auth}
            repo={sourceRepo}
            file={sourceFile}
          />
        </header>
      </Headroom>
      <div id='Workspace-Container' style={style.workspace}>
        <Workspace />
      </div>
    </>
  );

  if (criticalValidationErrors.length > 0) {
    component = validationDialog;
  };

  return (
    <div className='App' style={style.app}>
      <MuiThemeProvider theme={theme}>
        {component}
        <ConfirmDialog contentIsDirty={contentIsDirty || cacheWarningMessage} />
        <AutoSaveDialog />
      </MuiThemeProvider>
    </div>
  );
};