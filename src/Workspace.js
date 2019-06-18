import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Chip,
} from '@material-ui/core';
import {
  Translate,
  Settings,
} from '@material-ui/icons';
import ApplicationStepper from './components/application-stepper/ApplicationStepper';
import {DocumentTranslatable} from 'markdown-translatable';

import {getLanguage} from './components/languages/helpers';

function Workspace ({
  classes,
  authentication,
  onAuthentication,
  authenticationConfig,
  repositoryConfig,
  originalRepository,
  onOriginalRepository,
  translationRepository,
  originalBlob,
  onOriginalBlob,
  originalFile,
  translationFile,
  language,
  onLanguage,
}) {
  let translationFileContent;
  if (originalFile && translationFile) {
    translationFileContent = translationFile.content;
    const autoInitFileContent = `# ${translationRepository.name}\n\n${translationRepository.description}`;
    const autoInitFile = translationFile.content.trim() === autoInitFileContent;
    if (autoInitFile) translationFileContent = originalFile.content;
  } 
    

  let component;
  if (originalFile && translationFile) {
    const originalLanguage = getLanguage({languageId: originalRepository.name.split('_')[0]});
    component = (
      <>
        <Grid className={classes.headers} container wrap="nowrap" spacing={16}>
          <Grid item xs={12}>
            <Chip
              icon={<Translate />}
              label={`${originalRepository.owner.username} - ${originalLanguage.languageName}`}
              onDelete={()=> {}}
              deleteIcon={<Settings />}
              variant="outlined"
              className={classes.header}
              style={{background: '#fff9'}}
            />
          </Grid>
          <Grid item xs={12}>
            <Chip
              icon={<Translate />}
              label={`${translationRepository.owner.username} - ${language.languageName}`}
              onDelete={()=>{}}
              deleteIcon={<Settings />}
              variant="outlined"
              className={classes.header}
              style={{background: 'white'}}
            />
          </Grid>
        </Grid>
        <DocumentTranslatable
          original={originalFile.content}
          translation={translationFileContent}
          onTranslation={(edit) => {
            translationFile.saveContent(edit);
          }}
        />
      </>
    );
  } else {
    component = (
      <ApplicationStepper
        authentication={authentication}
        onAuthentication={onAuthentication}
        authenticationConfig={authenticationConfig}
        originalRepository={originalRepository}
        onOriginalRepository={onOriginalRepository}
        repositoryConfig={repositoryConfig}
        originalBlob={originalBlob}
        onOriginalBlob={onOriginalBlob}
        originalFile={originalFile}
        language={language}
        onLanguage={onLanguage}
      />
    );
  }

  return component;
}

const styles = theme => ({
  root: {
  },
  headers: {
    marginBottom: '0.2em',
  },
  header: {
    justifyContent: 'space-between',
    width: '100%',
  }
});

export default withStyles(styles)(Workspace);