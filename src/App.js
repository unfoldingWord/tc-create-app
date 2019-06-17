import React, { useState } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import {
  ApplicationBar,
  ensureRepo,
} from 'gitea-react-toolkit';
import Workspace from './Workspace';
import FilePopulator from './components/FilePopulator';
import appPackage from '../package.json';

import theme from './theme';

const config = { server: 'https://bg.door43.org' };
const authenticationConfig = {
  tokenid: appPackage.name,
  ...config,
};
const repositoryConfig = {
  ...config,
  urls: [
    'https://bg.door43.org/api/v1/repos/unfoldingword/en_ta',
    'https://bg.door43.org/api/v1/repos/unfoldingword/en_tw',
    'https://bg.door43.org/api/v1/repos/unfoldingword/en_tn',
    'https://bg.door43.org/api/v1/repos/unfoldingword/en_obs',
  ],
}

function App() {
  const [authentication, setAuthentication] = useState();
  const [originalRepository, setOriginalRepository] = useState();
  const [translationRepository, setTranslationRepository] = useState();
  const [originalBlob, setOriginalBlob] = useState();
  const [translationBlob, setTranslationBlob] = useState();
  const [originalFile, setOriginalFile] = useState();
  const [translationFile, setTranslationFile] = useState();
  const [language, setLanguage] = useState();

  const populateTranslationRepository = async () => {
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
  };
  if (authentication && originalRepository && language && !translationRepository) {
    populateTranslationRepository();
  }
  const needBlob = (originalBlob && !translationBlob);
  const needBlobUpdate = originalBlob && translationBlob && 
    (originalBlob.filepath !== translationBlob.filepath);
  if (needBlob || needBlobUpdate) {
    setTranslationBlob(originalBlob);
  }

  let filePopulator = [];
  if (!originalFile || originalFile.filepath !== originalBlob.filepath) {
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

  return (
    <div className="App">
      {filePopulator}
      <MuiThemeProvider theme={theme}>
        <header className="App-header">
          <ApplicationBar
            title="GL Translate"
            // buttons={buttons}
            // drawerMenu={drawerMenu}
            authentication={authentication}
            onAuthentication={setAuthentication}
            authenticationConfig={authenticationConfig}
            repository={originalRepository}
            onRepository={setOriginalRepository}
            repositoryConfig={repositoryConfig}
            blob={originalBlob}
            onBlob={setOriginalBlob}
          />
        </header>
        <div style={{margin: '1em'}}>
          <Workspace
            authentication={authentication}
            onAuthentication={setAuthentication}
            authenticationConfig={authenticationConfig}
            repositoryConfig={repositoryConfig}
            originalRepository={originalRepository}
            onOriginalRepository={setOriginalRepository}
            originalBlob={originalBlob}
            onOriginalBlob={setOriginalBlob}
            translationRepository={translationRepository}
            onTranslationRepository={setTranslationRepository}
            translationBlob={translationBlob}
            originalFile={originalFile}
            translationFile={translationFile}
            language={language}
            onLanguage={setLanguage}
          />
        </div>
      </MuiThemeProvider>
    </div>
  );
}

export default App;
