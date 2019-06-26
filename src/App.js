import React, { useEffect, setGlobal, useGlobal } from 'reactn';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Headroom from 'react-headroom';
import {
  ApplicationBar,
  ensureRepo,
} from 'gitea-react-toolkit';
import DrawerMenu from './components/drawer-menu/DrawerMenu';
import Workspace from './Workspace';
import FilePopulator from './components/FilePopulator';
import appPackage from '../package.json';

import theme from './theme';

const config = { server: 'https://bg.door43.org' };

setGlobal({
  sectionable: true,
  fontScale: 100,
  authenticationConfig: {
    ...config,
    tokenid: appPackage.name,
  },
  repositoryConfig: {
    ...config,
    urls: [
      'https://bg.door43.org/api/v1/repos/unfoldingword/en_ta',
      'https://bg.door43.org/api/v1/repos/unfoldingword/en_tw',
      'https://bg.door43.org/api/v1/repos/unfoldingword/en_tn',
      'https://bg.door43.org/api/v1/repos/unfoldingword/en_obs',
    ],
  },
});

function App() {
  const [authentication, setAuthentication] = useGlobal('authentication');
  const [originalRepository, setOriginalRepository] = useGlobal('originalRepository');
  const [translationRepository, setTranslationRepository] = useGlobal('translationRepository');
  const [originalBlob, setOriginalBlob] = useGlobal('originalBlob');
  const [translationBlob, setTranslationBlob] = useGlobal('translationBlob');
  const [originalFile, setOriginalFile] = useGlobal('originalFile');
  const [translationFile, setTranslationFile] = useGlobal('translationFile');
  const [language] = useGlobal('language');
  const [sectionable, setSectionable] = useGlobal('sectionable');
  const [authenticationConfig] = useGlobal('authenticationConfig');
  const [repositoryConfig] = useGlobal('repositoryConfig');
  const [fontScale, setFontScale] = useGlobal('fontScale');

  useEffect(() => {
    cleanup();
    populateTranslationRepository()
    .then(() => {
      populateTranslationBlob();
    });
  });

  const cleanup = () => {
    if (
      (!originalRepository && // no repo but remnants of an old one
        (originalBlob || originalFile || translationBlob || translationFile || translationRepository)
      ) ||
      (originalRepository && // theres a repo but it doesn't match the blob url
        (originalBlob && !originalBlob.url.includes(originalRepository.full_name))
      )
    ) {
      setTranslationFile();
      setTranslationBlob();
      setOriginalFile();
      setOriginalBlob();
      setTranslationRepository();
    }
  };

  const populateTranslationRepository = async () => {
    if (authentication && originalRepository && language && !translationRepository) {
      const repositoryNameArray = originalRepository.name.split('_');
      const resourceNameArray = repositoryNameArray.slice(1);
      const translationRepoName = `${language.languageId}_${resourceNameArray.join('_')}`;
      const {description} = originalRepository;
      const params = {
        owner: authentication.user.username,
        repo: translationRepoName,
        config: authentication.config,
        settings: {description}
      };
      const _translationRepository = await ensureRepo(params);
      setTranslationRepository(_translationRepository);
    }
  };

  const populateTranslationBlob = () => {
    const needBlob = (originalBlob && !translationBlob);
    const needBlobUpdate = originalBlob && translationBlob && 
      (originalBlob.filepath !== translationBlob.filepath);
    if (needBlob || needBlobUpdate) {
      setTranslationBlob(originalBlob);
    }
  };
  

  let filePopulator = [];
  if (
    (originalRepository && originalBlob) &&
    (!originalFile || originalFile.filepath !== originalBlob.filepath)
  ) {
    filePopulator.push(
      <FilePopulator
        key={Math.random()}
        authentication={authentication}
        repository={originalRepository}
        blob={originalBlob}
        file={originalFile}
        onFile={setOriginalFile}
      />
    );
  }
  if (originalFile && (!translationFile || translationFile.filepath !== translationBlob.filepath)) {
    const fileConfig = {
      filepath: originalFile.filepath,
      defaultContent: originalFile.content,
      ...authentication.config
    };
    filePopulator.push(
      <FilePopulator
        key={Math.random()}
        authentication={authentication}
        repository={translationRepository}
        blob={translationBlob}
        file={translationFile}
        onFile={setTranslationFile}
        fileConfig={fileConfig}
      />
    );
  }

  const drawerMenu = (
    <DrawerMenu
      sectionable={sectionable}
      onSectionable={setSectionable}
      fontScale={fontScale}
      onFontScale={setFontScale}
    />
  );

  const appStyle = {
    fontSize: `${fontScale/100}em`
  };
  return (
    <div className="App" style={appStyle}>
      {filePopulator}
      <MuiThemeProvider theme={theme}>
        <header className="App-header">
          <Headroom>
          <ApplicationBar
            title="GL Translate"
            // buttons={buttons}
            authentication={authentication}
            onAuthentication={setAuthentication}
            authenticationConfig={authenticationConfig}
            repository={originalRepository}
            onRepository={setOriginalRepository}
            repositoryConfig={repositoryConfig}
            blob={originalBlob}
            onBlob={setOriginalBlob}
            drawerMenu={drawerMenu}
          />
          </Headroom>
        </header>
        <div style={{margin: `${theme.spacing.unit * 2}px`}}>
          <Workspace
            authenticationConfig={authenticationConfig}
            repositoryConfig={repositoryConfig}
          />
        </div>
      </MuiThemeProvider>
    </div>
  );
}

export default App;
