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

function Workspace ({
  classes,
  authentication,
  onAuthentication,
  authenticationConfig,
  repositoryConfig,
  originalRepository,
  onOriginalRepository,
  translationRepository,
  onTranslationRepository,
  originalFile,
  translationFile,
  language,
  onLanguage,
}) {
  let component;
  if (originalFile && translationFile) {
    component = (
      <>
        <Grid className={classes.headers} container wrap="nowrap" spacing={16}>
          <Grid item xs={12}>
            <Chip
              icon={<Translate />}
              label={`${originalRepository.full_name}/${originalFile.filepath}`}
              onDelete={()=> originalRepository.close()}
              deleteIcon={<Settings />}
              variant="outlined"
              className={classes.header}
              style={{background: '#fff9'}}
            />
          </Grid>
          <Grid item xs={12}>
            <Chip
              icon={<Translate />}
              label={`${translationRepository.full_name}/${translationFile.filepath}`}
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
          translation={translationFile.content}
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